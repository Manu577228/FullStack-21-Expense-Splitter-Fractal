# ----------------------------------------------------------------------------
#   ( The Authentic JS/JAVA/PYTHON CodeBuff )
#  ___ _                      _              _
#  | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
#  | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
#  |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
#                                         |__/
# ----------------------------------------------------------------------------


from decimal import Decimal, ROUND_HALF_UP
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Group, Expense, Contribution

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")


class GroupSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ("id", "name", "created_by", "members",
                  "member_count", "created_at")

    def get_member_count(self, obj):
        return obj.members.count()


class ContributionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Contribution
        fields = ("user", "amount")


class ExpenseSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    contributions = ContributionSerializer(many=True, read_only=True)

    class Meta:
        model = Expense
        fields = (
            "id", "group", "description", "amount", "split_type",
            "created_by", "created_at", "contributions"
        )


class AddExpenseSerializer(serializers.Serializer):
    description = serializers.CharField(max_length=255, required=True)
    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal('0.01'),
        required=True
    )
    split_type = serializers.ChoiceField(
        choices=[("equal", "Equal"), ("custom", "Custom")],
        required=True
    )
    contributions = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        allow_empty=True
    )

    def validate(self, data):
        group = self.context["group"]
        members = list(group.members.all())
        amount = data["amount"]
        split_type = data["split_type"]

        if not members:
            raise serializers.ValidationError(
                "Group must have at least one member.")

        if len(members) < 2:
            raise serializers.ValidationError(
                "Group must have at least 2 members to add expenses.")

        # Process based on split type
        if split_type == "equal":
            # Generate equal contributions
            data["normalized_contributions"] = self._generate_equal_split(
                members, amount)
        else:  # custom split
            contributions = data.get("contributions", [])
            if not contributions:
                raise serializers.ValidationError(
                    "Contributions are required for custom split.")

            data["normalized_contributions"] = self._validate_custom_split(
                contributions, members, amount)

        return data

    def _generate_equal_split(self, members, amount):
        """Generate equal split contributions for all members"""
        member_count = len(members)
        per_person = (amount / Decimal(member_count)
                      ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        # Handle rounding differences
        total_distributed = per_person * member_count
        difference = amount - total_distributed

        contributions = []
        for i, member in enumerate(members):
            contribution_amount = per_person
            # Add rounding difference to first member
            if i == 0:
                contribution_amount += difference

            contributions.append({
                "user_id": member.id,
                "amount": contribution_amount.quantize(Decimal("0.01"))
            })

        return contributions

    def _validate_custom_split(self, contributions, members, amount):
        """Validate and normalize custom split contributions"""
        member_ids = {member.id for member in members}
        seen_users = set()
        total_contributions = Decimal("0.00")
        normalized_contributions = []

        for contrib in contributions:
            # Validate user ID
            user_id = contrib.get("user")
            if not user_id:
                raise serializers.ValidationError(
                    "Each contribution must include a user ID.")

            try:
                user_id = int(user_id)
            except (ValueError, TypeError):
                raise serializers.ValidationError(
                    "Invalid user ID in contributions.")

            if user_id not in member_ids:
                raise serializers.ValidationError(
                    f"User {user_id} is not a member of this group.")

            if user_id in seen_users:
                raise serializers.ValidationError(
                    "Duplicate user found in contributions.")

            seen_users.add(user_id)

            # Validate amount
            try:
                contrib_amount = Decimal(str(contrib.get("amount", 0)))
            except (ValueError, TypeError, decimal.InvalidOperation):
                raise serializers.ValidationError(
                    "Invalid amount in contributions.")

            if contrib_amount < 0:
                raise serializers.ValidationError(
                    "Contribution amounts cannot be negative.")

            contrib_amount = contrib_amount.quantize(
                Decimal("0.01"), rounding=ROUND_HALF_UP)
            total_contributions += contrib_amount

            normalized_contributions.append({
                "user_id": user_id,
                "amount": contrib_amount
            })

        # Ensure all members have contributions
        if len(normalized_contributions) != len(members):
            missing_members = member_ids - seen_users
            if missing_members:
                raise serializers.ValidationError(
                    "All group members must have contribution amounts specified."
                )

        # Verify total matches expense amount
        if abs(total_contributions - amount) > Decimal("0.01"):
            raise serializers.ValidationError(
                f"Sum of contributions (₹{total_contributions}) must equal total amount (₹{amount})."
            )

        return normalized_contributions

    def create(self, validated_data):
        group = self.context["group"]
        user = self.context["user"]

        # Create the expense
        expense = Expense.objects.create(
            group=group,
            description=validated_data["description"],
            amount=validated_data["amount"],
            split_type=validated_data["split_type"],
            created_by=user,
        )

        # Create contributions
        contributions_data = validated_data["normalized_contributions"]
        contributions = []

        for contrib in contributions_data:
            contributions.append(
                Contribution(
                    expense=expense,
                    user_id=contrib["user_id"],
                    amount=contrib["amount"]
                )
            )

        Contribution.objects.bulk_create(contributions)

        # Refresh expense to get contributions
        expense.refresh_from_db()
        return expense
