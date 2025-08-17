# ----------------------------------------------------------------------------
#   ( The Authentic JS/JAVA/PYTHON CodeBuff )
#  ___ _                      _              _ 
#  | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
#  | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
#  |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
#                                         |__/ 
# ----------------------------------------------------------------------------

from django.db import models
from django.contrib.auth.models import User

class Group(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class GroupSummary(models.Model):
    group = models.OneToOneField(Group, on_delete=models.CASCADE, related_name="summary")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    transactions = models.IntegerField()
    members_count = models.IntegerField()
    balances = models.JSONField()  # Stores { username, paid, owes }
    recent_expenses = models.JSONField()  # Stores list of expenses
    updated_at = models.DateTimeField(auto_now=True)
