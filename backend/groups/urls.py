# ----------------------------------------------------------------------------
#   ( The Authentic JS/JAVA/PYTHON CodeBuff )
#  ___ _                      _              _ 
#  | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
#  | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
#  |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
#                                         |__/ 
# ----------------------------------------------------------------------------

from django.urls import path
from . import views

urlpatterns = [
    # Group management
    path('', views.GroupListCreateView.as_view(), name='group-list-create'),
    path('<int:pk>/', views.GroupDetailView.as_view(), name='group-detail'),
    path('<int:group_id>/delete/', views.delete_group, name='group-delete'),
    
    # Member management
    path('<int:group_id>/members/', views.GroupMembersView.as_view(), name='group-members'),
    path('<int:group_id>/add-member/', views.add_member, name='add-member'),
    
    # Expense management
    path('<int:group_id>/expenses/', views.GroupExpensesView.as_view(), name='group-expenses'),
    path('<int:group_id>/add-expense/', views.add_expense, name='add-expense'),
    
    # Summary
    path('<int:group_id>/summary/', views.group_summary, name='group-summary'),
]