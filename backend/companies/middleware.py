from django.utils.functional import SimpleLazyObject
from .models import CompanyUser

def get_company(request):
    company_id = request.headers.get('X-Company-ID')
    if not company_id or not request.user.is_authenticated:
        return None
        
    try:
        if request.user.is_superuser or request.user.is_system_admin:
            company_user = CompanyUser.objects.select_related('company').filter(
                company_id=company_id,
                company__is_active=True
            ).first()
        else:
            company_user = CompanyUser.objects.select_related('company').get(
                user=request.user,
                company_id=company_id,
                company__is_active=True,
                is_active=True
            )
        return company_user.company if company_user else None
    except CompanyUser.DoesNotExist:
        return None

class CompanyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.company = SimpleLazyObject(lambda: get_company(request))
        return self.get_response(request)