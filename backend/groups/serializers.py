# ----------------------------------------------------------------------------
#   ( The Authentic JS/JAVA/PYTHON CodeBuff )
#  ___ _                      _              _ 
#  | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
#  | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
#  |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
#                                         |__/ 
# ----------------------------------------------------------------------------

from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction
from .models import Group, GroupMember, GroupExpense, ExpenseSplit
from decimal import Decimal


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class GroupMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = GroupMember
        fields = ['id', 'user', 'joined_at', 'is_admin']


class GroupSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    members = GroupMemberSerializer(many=True, read_only=True)
    member_count = serializers.ReadOnlyField()
    total_expenses = serializers.ReadOnlyField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'created_by', 'created_at', 'updated_at', 
                 'members', 'member_count', 'total_expenses']

    def create(self, validated_data):
        with transaction.atomic():
            group = Group.objects.create(**validated_data)
            # Add creator as admin member
            GroupMember.objects.create(
                group=group,
                user=validated_data['created_by'],
                is_admin=True
            )
            return group


class AddMemberSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    
    def validate_username(self, value):
        if not User.objects.filter(username=value).exists():
            # Create user if doesn't exist (for demo purposes)
            User.objects.create_user(
                username=value,
                email=f"{value.lower()}@example.com",
                password="defaultpassword123"
            )
        return value

    def create(self, validated_data):
        group = self.context['group']
        username = validated_data['username']
        user = User.objects.get(username=username)
        
        member, created = GroupMember.objects.get_or_create(
            group=group,
            user=user,
            defaults={'is_admin': False}
        )
        
        if not created:
            raise serializers.ValidationError("User is already a member of this group")
        
        return member


class ExpenseSplitSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ExpenseSplit
        fields = ['user', 'username', 'amount']


class GroupExpenseSerializer(serializers.ModelSerializer):
    paid_by_username = serializers.CharField(source='paid_by.username', read_only=True)
    splits = ExpenseSplitSerializer(many=True, read_only=True)
    
    class Meta:
        model = GroupExpense
        fields = ['id', 'description', 'amount', 'paid_by', 'paid_by_username', 
                 'split_type', 'created_at', 'updated_at', 'splits']


class CreateExpenseSerializer(serializers.Serializer):
    description = serializers.CharField(max_length=200)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.01)
    paid_by_username = serializers.CharField()
    split_type = serializers.ChoiceField(choices=['equal', 'custom'], default='equal')
    custom_splits = serializers.DictField(child=serializers.DecimalField(max_digits=10, decimal_places=2), required=False)
    
    def validate_paid_by_username(self, value):
        group = self.context['group']
        if not GroupMember.objects.filter(group=group, user__username=value).exists():
            raise serializers.ValidationError("User must be a member of the group")
        return value
    
    def validate(self, data):
        if data['split_type'] == 'custom':
            if not data.get('custom_splits'):
                raise serializers.ValidationError("Custom splits are required for custom split type")
            
            total_custom = sum(data['custom_splits'].values())
            if abs(total_custom - data['amount']) > Decimal('0.01'):
                raise serializers.ValidationError("Custom split amounts must add up to total amount")
                
            # Validate all users in custom splits are members
            group = self.context['group']
            member_usernames = set(
                GroupMember.objects.filter(group=group).values_list('user__username', flat=True)
            )
            for username in data['custom_splits'].keys():
                if username not in member_usernames:
                    raise serializers.ValidationError(f"User {username} is not a member of the group")
        
        return data
    
    def create(self, validated_data):
        group = self.context['group']
        paid_by_user = User.objects.get(username=validated_data['paid_by_username'])
        
        with transaction.atomic():
            expense = GroupExpense.objects.create(
                group=group,
                description=validated_data['description'],
                amount=validated_data['amount'],
                paid_by=paid_by_user,
                split_type=validated_data['split_type']
            )
            
            # Create splits
            if validated_data['split_type'] == 'equal':
                members = GroupMember.objects.filter(group=group)
                split_amount = validated_data['amount'] / members.count()
                
                for member in members:
                    ExpenseSplit.objects.create(
                        expense=expense,
                        user=member.user,
                        amount=split_amount
                    )
            else:  # custom
                for username, amount in validated_data['custom_splits'].items():
                    user = User.objects.get(username=username)
                    ExpenseSplit.objects.create(
                        expense=expense,
                        user=user,
                        amount=amount
                    )
            
            return expense


class GroupSummarySerializer(serializers.Serializer):
    member_balances = serializers.ListField(read_only=True)
    total_amount = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    total_expenses_count = serializers.IntegerField(read_only=True)
    recent_expenses = GroupExpenseSerializer(many=True, read_only=True)