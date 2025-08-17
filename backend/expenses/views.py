# ----------------------------------------------------------------------------
#   ( The Authentic JS/JAVA/PYTHON CodeBuff )
#  ___ _                      _              _ 
#  | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
#  | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
#  |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
#                                         |__/ 
# ----------------------------------------------------------------------------

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json
from .models import Group, GroupSummary

@csrf_exempt
def expense_summary(request, group_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            group = get_object_or_404(Group, id=group_id)

            summary, created = GroupSummary.objects.update_or_create(
                group=group,
                defaults={
                    "total_amount": data.get("totalAmount", 0),
                    "transactions": data.get("transactions", 0),
                    "members_count": data.get("membersCount", 0),
                    "balances": data.get("balances", []),
                    "recent_expenses": data.get("recentExpenses", [])
                }
            )

            return JsonResponse({
                "message": "Summary saved successfully",
                "created": created
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    elif request.method == "GET":
        group = get_object_or_404(Group, id=group_id)
        summary = getattr(group, "summary", None)
        if summary:
            return JsonResponse({
                "total_amount": summary.total_amount,
                "transactions": summary.transactions,
                "members_count": summary.members_count,
                "balances": summary.balances,
                "recent_expenses": summary.recent_expenses
            })
        return JsonResponse({"message": "No summary found"}, status=404)

    return JsonResponse({"error": "Method not allowed"}, status=405)
