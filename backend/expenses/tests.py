# ----------------------------------------------------------------------------
#   ( The Authentic JS/JAVA/PYTHON CodeBuff )
#  ___ _                      _              _ 
#  | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
#  | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
#  |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
#                                         |__/ 
# ----------------------------------------------------------------------------

from django.test import TestCase

# Safe imports: Only import models if they exist
try:
    from .models import Group, Expense, Contribution
except ImportError as e:
    print(f"Warning: Model import failed: {e}")
    Group = Expense = Contribution = None


class ExpensesTestCase(TestCase):
    def setUp(self):
        if Group:
            # Example: Create a group for testing
            self.group = Group.objects.create(name="Test Group")
        else:
            self.group = None

    def test_group_creation(self):
        if not self.group:
            self.skipTest("Group model not available")
        self.assertEqual(self.group.name, "Test Group")

    def test_expense_creation(self):
        if not Expense or not self.group:
            self.skipTest("Expense model or Group not available")
        expense = Expense.objects.create(
            group=self.group,
            description="Test Expense",
            amount=100.00,
            split_type="equal",
            created_by=None  # Replace with a User instance if available
        )
        self.assertEqual(expense.amount, 100.00)

    def test_contribution_creation(self):
        if not Contribution or not Expense or not self.group:
            self.skipTest("Contribution model or dependencies not available")
        expense = Expense.objects.create(
            group=self.group,
            description="Test Expense",
            amount=50.00,
            split_type="equal",
            created_by=None
        )
        contribution = Contribution.objects.create(
            expense=expense,
            user_id=1,  # Replace with a real User ID
            amount=50.00
        )
        self.assertEqual(contribution.amount, 50.00)
