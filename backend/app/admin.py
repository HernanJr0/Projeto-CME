from django.contrib import admin
from app.models import CustomUser, Material, Process, Failure, History

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'password')
        }),
        ('Permissions', {
            'fields': ('is_staff', 'is_active', 'groups', 'user_permissions')
        }),
        ('Role', {
            'fields': ('role',)
        }),
    )

admin.site.register(History)
admin.site.register(Material)
admin.site.register(Process)
admin.site.register(Failure)
