from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Company, CompanyUser
from .serializers import CompanySerializer, CompanyUserSerializer, CompanyTokenObtainPairSerializer
from .permissions import IsCompanyAdmin
from rest_framework_simplejwt.views import TokenObtainPairView


class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return Company.objects.all()
        return Company.objects.filter(
            company_users__user=self.request.user,
            company_users__is_active=True
        )

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    # Añadir este método para obtener usuarios de una empresa
    @action(detail=True, methods=['GET'], url_path='users')
    def get_company_users(self, request, pk=None):
        company = self.get_object()
        
        # Filtrar usuarios de la empresa
        company_users = CompanyUser.objects.filter(
            company=company,
            is_active=True
        ).select_related('user', 'company')
        
        # Serializar los usuarios
        serializer = CompanyUserSerializer(company_users, many=True)
        return Response(serializer.data)
    
    


class CompanyTokenObtainPairView(TokenObtainPairView):
    serializer_class = CompanyTokenObtainPairSerializer
    
