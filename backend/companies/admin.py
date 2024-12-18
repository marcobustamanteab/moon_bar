from django.contrib import admin
from .models import Company, CompanyUser

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'rut', 'email', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'rut', 'email']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(CompanyUser)
class CompanyUserAdmin(admin.ModelAdmin):
    list_display = ['user', 'company', 'role', 'is_company_admin', 'is_active']
    list_filter = ['role', 'is_company_admin', 'is_active']
    search_fields = ['user__username', 'company__name']
    readonly_fields = ['created_at', 'updated_at']