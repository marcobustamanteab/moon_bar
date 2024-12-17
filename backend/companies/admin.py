# companies/admin.py
from django.contrib import admin
from .models import Company, CompanyModule, CompanyUser

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'rut', 'email', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'rut', 'email']

@admin.register(CompanyModule)
class CompanyModuleAdmin(admin.ModelAdmin):
    list_display = ['company', 'name', 'is_active', 'created_at']
    list_filter = ['is_active', 'name']
    search_fields = ['company__name']

@admin.register(CompanyUser)
class CompanyUserAdmin(admin.ModelAdmin):
    list_display = ['user', 'company', 'role', 'is_company_admin', 'is_active']
    list_filter = ['role', 'is_company_admin', 'is_active']
    search_fields = ['user__username', 'company__name']