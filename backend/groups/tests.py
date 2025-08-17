# ----------------------------------------------------------------------------
#   ( The Authentic JS/JAVA/PYTHON CodeBuff )
#  ___ _                      _              _ 
#  | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
#  | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
#  |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
#                                         |__/ 
# ----------------------------------------------------------------------------

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Group, GroupMember, GroupExpense, ExpenseSplit

class GroupAppTests(TestCase):
    def setUp(self):
        # API client with authentication
        self.client = APIClient()

        # Create test users
        self.user1 = User.objects.create_user(username='user1', password='pass123')
        self.user2 = User.objects.create_user(username='user2', password='pass123')
        self.client.force_authenticate(user=self.user1)

        # Create test group
        self.group = Group.objects.create(name="Test Group", created_by=self.user1)
        GroupMember.objects.create(group=self.group, user=self.user1, is_admin=True)
        GroupMember.objects.create(group=self.group, user=self.user2, is_admin=False)

    def test_group_list_and_detail(self):
        # List groups
        url = reverse('group-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        # Detail view
        url = reverse('group-detail', args=[self.group.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_add_member_serializer(self):
        from .serializers import AddMemberSerializer
        # Create a new user
        new_user = User.objects.create_user(username='user3', password='pass123')
        data = {'username': 'user3'}
        serializer = AddMemberSerializer(data=data, context={'group': self.group})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        member = serializer.save()
        self.assertEqual(member.user.username, 'user3')

    def test_create_expense_equal_split(self):
        from .serializers import CreateExpenseSerializer
        data = {
            'description': 'Dinner',
            'amount': '100.00',
            'paid_by_username': 'user1',
            'split_type': 'equal'
        }
        serializer = CreateExpenseSerializer(data=data, context={'group': self.group})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        expense = serializer.save()

        splits = ExpenseSplit.objects.filter(expense=expense)
        self.assertEqual(splits.count(), 2)
        self.assertAlmostEqual(float(splits.first().amount), 50.0)

    def test_create_expense_custom_split(self):
        from .serializers import CreateExpenseSerializer
        data = {
            'description': 'Taxi',
            'amount': '30.00',
            'paid_by_username': 'user2',
            'split_type': 'custom',
            'custom_splits': {'user1': '10.00', 'user2': '20.00'}
        }
        serializer = CreateExpenseSerializer(data=data, context={'group': self.group})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        expense = serializer.save()

        splits = ExpenseSplit.objects.filter(expense=expense)
        self.assertEqual(splits.count(), 2)
        self.assertAlmostEqual(float(splits.get(user=self.user1).amount), 10.0)
        self.assertAlmostEqual(float(splits.get(user=self.user2).amount), 20.0)

    def test_group_summary_serializer(self):
        from .serializers import GroupSummarySerializer
        serializer = GroupSummarySerializer(instance={
            'member_balances': [],
            'total_amount': 130.00,
            'total_expenses_count': 2,
            'recent_expenses': GroupExpense.objects.all()
        })
        self.assertAlmostEqual(float(serializer.data['total_amount']), 130.0)
        self.assertEqual(serializer.data['total_expenses_count'], 2)
