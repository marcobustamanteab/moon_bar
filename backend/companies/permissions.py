from rest_framework import permissions
from .models import CompanyUser

class IsCompanyAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.is_superuser or request.user.is_system_admin:
            return True

        company_id = view.kwargs.get('company_id')
        if not company_id:
            return False

        return CompanyUser.objects.filter(
            user=request.user,
            company_id=company_id,
            is_company_admin=True,
            is_active=True
        ).exists()

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser or request.user.is_system_admin:
            return True

        if hasattr(obj, 'company'):
            company = obj.company
        elif isinstance(obj, Company):
            company = obj
        else:
            return False

        return CompanyUser.objects.filter(
            user=request.user,
            company=company,
            is_company_admin=True,
            is_active=True
        ).exists()

class IsCompanyMember(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.is_superuser or request.user.is_system_admin:
            return True

        company_id = request.headers.get('X-Company-ID')
        if not company_id:
            return False

        return CompanyUser.objects.filter(
            user=request.user,
            company_id=company_id,
            is_active=True
        ).exists()