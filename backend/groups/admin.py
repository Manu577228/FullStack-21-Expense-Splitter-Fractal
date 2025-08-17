# ----------------------------------------------------------------------------
#   ( The Authentic JS/JAVA/PYTHON CodeBuff )
#  ___ _                      _              _ 
#  | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
#  | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
#  |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
#                                         |__/ 
# ----------------------------------------------------------------------------

from django.contrib import admin
from .models import Group, GroupMember, GroupExpense, ExpenseSplit


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'member_count', 'total_expenses', 'created_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('name', 'created_by__username')
    readonly_fields = ('created_at', 'updated_at', 'member_count', 'total_expenses')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('created_by')


@admin.register(GroupMember)
class GroupMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'group', 'is_admin', 'joined_at')
    list_filter = ('is_admin', 'joined_at')
    search_fields = ('user__username', 'group__name')
    readonly_fields = ('joined_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'group')


class ExpenseSplitInline(admin.TabularInline):
    model = ExpenseSplit
    extra = 0
    readonly_fields = ('user',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(GroupExpense)
class GroupExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'amount', 'paid_by', 'group', 'split_type', 'created_at')
    list_filter = ('split_type', 'created_at', 'group')
    search_fields = ('description', 'paid_by__username', 'group__name')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ExpenseSplitInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('paid_by', 'group')


@admin.register(ExpenseSplit)
class ExpenseSplitAdmin(admin.ModelAdmin):
    list_display = ('user', 'expense', 'amount')
    list_filter = ('expense__created_at', 'expense__group')
    search_fields = ('user__username', 'expense__description')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'expense')