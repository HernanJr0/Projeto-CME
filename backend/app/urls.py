from rest_framework.routers import DefaultRouter
from app.views import TodoItemViewSet

router = DefaultRouter()
router.register(r'', TodoItemViewSet)
urlpatterns = router.urls