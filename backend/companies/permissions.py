from rest_framework import permissions

from .models import CompanyModule, CompanyUser

class IsCompanyAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        company_id = view.kwargs.get('company_id')
        if not company_id:
            return False
            
        return CompanyUser.objects.filter(
            user=request.user,
            company_id=company_id,
            is_company_admin=True,
            is_active=True
        ).exists()

class HasModulePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        company_id = request.headers.get('X-Company-ID')
        if not company_id:
            return False
            
        module_name = getattr(view, 'required_module', None)
        if not module_name:
            return True
            
        return CompanyModule.objects.filter(
            company_id=company_id,
            name=module_name,
            is_active=True
        ).exists()