
import logging
from decimal import Decimal

from django.db import transaction

from .models import Group, GroupSummary, ProcessedEvent


logger = logging.getLogger(__name__)


def _add(balances, user_id, field, value):
    row = balances.setdefault(
        str(user_id),
        {"paid": "0.00", "owes": "0.00"}
    )

    row[field] = str(
        Decimal(row[field]) + Decimal(value)
    )


@transaction.atomic
def apply_event(evt):
    if evt.get("type") != "EXPENSE_CREATED":
        return

    event_id = evt["event_id"]
    group_id = evt["group_id"]

    # Ensure idempotent event processing.
    _, fresh = ProcessedEvent.objects.get_or_create(
        event_id=event_id
    )

    if not fresh:
        return

    # Lock the parent group to prevent concurrent deletion
    # while updating its summary.
    group = (
        Group.objects
        .select_for_update()
        .filter(pk=group_id)
        .first()
    )

    # Ignore stale events belonging to deleted groups.
    if group is None:
        logger.warning(
            "Skipping stale event %s: group %s does not exist",
            event_id,
            group_id
        )
        return

    summary, _ = (
        GroupSummary.objects
        .select_for_update()
        .get_or_create(group_id=group_id)
    )

    amount = Decimal(evt["amount"])

    summary.total_amount += amount
    summary.transactions += 1

    _add(
        summary.balances,
        evt["paid_by"],
        "paid",
        amount
    )

    for uid, amt in evt["splits"].items():
        _add(
            summary.balances,
            uid,
            "owes",
            amt
        )

    summary.save()
