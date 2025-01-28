from django.contrib import admin
from django.urls import path, include

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="CME API",
        default_version='v1',
        description="Documentação da API de gerenciamento de CME.",
        contact=openapi.Contact(email="hernanjunior90@gmail.com"),
    ),
    public=True,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app.urls')),
    
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-docs'),
    
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='redoc-docs'),
]
