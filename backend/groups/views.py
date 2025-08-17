# ----------------------------------------------------------------------------
#   ( The Authentic JS/JAVA/PYTHON CodeBuff )
#  ___ _                      _              _ 
#  | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
#  | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
#  |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
#                                         |__/ 
# ----------------------------------------------------------------------------

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Sum, Q
from collections import defaultdict
from decimal import Decimal

from .models import Group, GroupMember, GroupExpense, ExpenseSplit
from .serializers import (
    GroupSerializer, AddMemberSerializer, CreateExpenseSerializer,
    GroupExpenseSerializer, GroupSummarySerializer
)


class GroupListCreateView(generics.ListCreateAPIView):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Group.objects.filter(
            members__user=self.request.user
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Group.objects.filter(
            Q(created_by=self.request.user) | Q(members__user=self.request.user)
        ).distinct()


class GroupMembersView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id)
        
        # Check if user is member of the group
        if not GroupMember.objects.filter(group=group, user=request.user).exists():
            return Response(
                {"error": "You are not a member of this group"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        members = GroupMember.objects.filter(group=group).select_related('user')
        members_data = []
        
        for member in members:
            members_data.append({
                'id': member.user.id,
                'username': member.user.username,
                'email': member.user.email,
                'is_admin': member.is_admin,
                'joined_at': member.joined_at
            })
        
        return Response({'members': members_data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_member(request, group_id):
    group = get_object_or_404(Group, id=group_id)
    
    # Check if user is member of the group
    if not GroupMember.objects.filter(group=group, user=request.user).exists():
        return Response(
            {"error": "You are not a member of this group"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = AddMemberSerializer(data=request.data, context={'group': group})
    if serializer.is_valid():
        try:
            member = serializer.save()
            return Response({
                'message': f'Successfully added {member.user.username} to the group!',
                'member': {
                    'id': member.user.id,
                    'username': member.user.username,
                    'email': member.user.email,
                    'is_admin': member.is_admin
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GroupExpensesView(generics.ListAPIView):
    serializer_class = GroupExpenseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        group_id = self.kwargs['group_id']
        group = get_object_or_404(Group, id=group_id)
        
        # Check if user is member of the group
        if not GroupMember.objects.filter(group=group, user=self.request.user).exists():
            return GroupExpense.objects.none()
        
        return GroupExpense.objects.filter(group=group).select_related('paid_by')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_expense(request, group_id):
    group = get_object_or_404(Group, id=group_id)
    
    # Check if user is member of the group
    if not GroupMember.objects.filter(group=group, user=request.user).exists():
        return Response(
            {"error": "You are not a member of this group"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = CreateExpenseSerializer(data=request.data, context={'group': group})
    if serializer.is_valid():
        try:
            expense = serializer.save()
            return Response({
                'message': 'Expense added successfully!',
                'expense': GroupExpenseSerializer(expense).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def group_summary(request, group_id):
    group = get_object_or_404(Group, id=group_id)
    
    # Check if user is member of the group
    if not GroupMember.objects.filter(group=group, user=request.user).exists():
        return Response(
            {"error": "You are not a member of this group"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get all members
    members = GroupMember.objects.filter(group=group).select_related('user')
    
    # Get all expenses
    expenses = GroupExpense.objects.filter(group=group).select_related('paid_by').prefetch_related('splits__user')
    
    # Calculate balances
    balances = defaultdict(lambda: {'paid': Decimal('0.00'), 'owes': Decimal('0.00')})
    
    for member in members:
        balances[member.user.username] = {
            'id': member.user.id,
            'username': member.user.username,
            'email': member.user.email,
            'paid': Decimal('0.00'),
            'owes': Decimal('0.00')
        }
    
    # Calculate what each member paid
    for expense in expenses:
        balances[expense.paid_by.username]['paid'] += expense.amount
    
    # Calculate what each member owes
    for expense in expenses:
        for split in expense.splits.all():
            balances[split.user.username]['owes'] += split.amount
    
    # Calculate net balance (positive means they should receive, negative means they owe)
    member_balances = []
    for username, balance in balances.items():
        net_balance = balance['paid'] - balance['owes']
        member_balances.append({
            'id': balance['id'],
            'username': balance['username'],
            'email': balance['email'],
            'paid': float(balance['paid']),
            'owes': float(balance['owes']),
            'net_balance': float(net_balance)
        })
    
    # Recent expenses (last 10)
    recent_expenses = expenses[:10]
    
    # Total amount
    total_amount = expenses.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
    
    summary_data = {
        'member_balances': member_balances,
        'total_amount': float(total_amount),
        'total_expenses_count': expenses.count(),
        'recent_expenses': GroupExpenseSerializer(recent_expenses, many=True).data
    }
    
    return Response(summary_data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_group(request, group_id):
    group = get_object_or_404(Group, id=group_id)
    
    # Only creator can delete the group
    if group.created_by != request.user:
        return Response(
            {"error": "Only the group creator can delete the group"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    group.delete()
    return Response({"message": "Group deleted successfully"}, status=status.HTTP_200_OK)