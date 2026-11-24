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
from django.db.models import Sum, Q, Count
from collections import defaultdict
from decimal import Decimal

from .models import Group, GroupMember, GroupExpense, ExpenseSplit, GroupSummary
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

    if not GroupMember.objects.filter(group=group, user=request.user).exists():
        return Response(
            {"error": "You are not a member of this group"},
            status=status.HTTP_403_FORBIDDEN
        )

    members = GroupMember.objects.filter(group=group).select_related('user')
    summary = GroupSummary.objects.filter(group=group).first()
    expenses = GroupExpense.objects.filter(group=group)
    totals = expenses.aggregate(total=Sum('amount'), count=Count('id'))
    total_amount = totals['total'] or Decimal('0.00')
    total_count = totals['count']
    is_synced = (summary is not None and summary.transactions == total_count
                 and summary.total_amount == total_amount)

    if is_synced:
        stored = summary.balances
    else:
        stored = {}
        for row in expenses.order_by().values('paid_by_id').annotate(total=Sum('amount')):
            stored[str(row['paid_by_id'])] = {'paid': str(row['total']), 'owes': '0.00'}
        for row in ExpenseSplit.objects.filter(expense__group=group).order_by().values('user_id').annotate(total=Sum('amount')):
            balance = stored.setdefault(str(row['user_id']), {'paid': '0.00', 'owes': '0.00'})
            balance['owes'] = str(row['total'])

    member_balances = []
    for m in members:
        row = stored.get(str(m.user.id), {"paid": "0.00", "owes": "0.00"})
        paid, owes = Decimal(row["paid"]), Decimal(row["owes"])
        member_balances.append({
            'id': m.user.id,
            'username': m.user.username,
            'email': m.user.email,
            'paid': float(paid),
            'owes': float(owes),
            'net_balance': float(paid - owes),
        })

    expenses = GroupExpense.objects.filter(group=group).select_related('paid_by').prefetch_related('splits__user')

    return Response({
        'member_balances': member_balances,
        'total_amount': float(total_amount),
        'total_expenses_count': total_count,
        'is_synced': is_synced,
        'summary_source': 'projection' if is_synced else 'database',
        'last_updated_at': summary.updated_at if summary else None,
        'recent_expenses': GroupExpenseSerializer(expenses[:10], many=True).data,
    })


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