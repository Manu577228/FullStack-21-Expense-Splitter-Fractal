from decimal import Decimal
from django.db import transaction
from .models import GroupSummary, ProcessedEvent


def _add(balances, user_id, field, value):
    row = balances.setdefault(str(user_id), {"paid": "0.00", "owes": "0.00"})
    row[field] = str(Decimal(row[field]) + Decimal(value))


@transaction.atomic
def apply_event(evt):
    if evt.get("type") != "EXPENSE_CREATED":
        return
    _, fresh = ProcessedEvent.objects.get_or_create(event_id=evt["event_id"])
    if not fresh:
        return  # duplicate delivery, skip
    summary, _ = GroupSummary.objects.select_for_update().get_or_create(
        group_id=evt["group_id"]
    )
    summary.total_amount += Decimal(evt["amount"])
    summary.transactions += 1
    _add(summary.balances, evt["paid_by"], "paid", evt["amount"])
    for uid, amt in evt["splits"].items():
        _add(summary.balances, uid, "owes", amt)
    summary.save()
