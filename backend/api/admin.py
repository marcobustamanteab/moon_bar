from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserActivityLog

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_system_admin')
    list_filter = ('is_staff', 'is_superuser', 'is_system_admin', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Información adicional', {'fields': ('phone', 'is_system_admin')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información adicional', {
            'fields': ('email', 'first_name', 'last_name', 'phone', 'is_system_admin')
        }),
    )

@admin.register(UserActivityLog)
class UserActivityLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'timestamp', 'ip_address', 'company')
    list_filter = ('activity_type', 'timestamp', 'company')
    search_fields = ('user__username', 'details', 'ip_address')
    readonly_fields = ('timestamp',)
    ordering = ('-timestamp',)