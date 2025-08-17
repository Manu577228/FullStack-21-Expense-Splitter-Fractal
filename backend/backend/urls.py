# ----------------------------------------------------------------------------
#   ( The Authentic JS/JAVA/PYTHON CodeBuff )
#  ___ _                      _              _ 
#  | _ ) |_  __ _ _ _ __ _ __| |_ __ ____ _ (_)
#  | _ \ ' \/ _` | '_/ _` / _` \ V  V / _` || |
#  |___/_||_\__,_|_| \__,_\__,_|\_/\_/\__,_|/ |
#                                         |__/ 
# ----------------------------------------------------------------------------

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users import views as user_views  # import get_profile

def home(request):
    return JsonResponse({"message": "Django backend is running!"})

urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),

    # Existing users API users
    path("api/users/", include("users.urls")),

    # expenses
    path('api/expenses/', include('expenses.urls')),

    #groups
    path('api/groups/', include('groups.urls')),  

    # JWT endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Profile endpoint for frontend
    path("api/profile/", user_views.get_profile, name="get_profile"),
]
