from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from app.views import (
    RegisterView,
    UserProfileView,
    UsersListView,
    UserDetailView,
    MaterialViewSet,
    ProcessViewSet,
    FailureViewSet,
    RelatorioViewSet,
)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'materials', MaterialViewSet, basename='materials')
router.register(r'processes', ProcessViewSet, basename='processes')
router.register(r'failures', FailureViewSet, basename='failures')
router.register(r'report', RelatorioViewSet, basename='report')

urlpatterns = router.urls + [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('users/', UsersListView.as_view(), name='users'),
    path('users/<int:user_id>/', UserDetailView.as_view(), name='user_detail'),
]
