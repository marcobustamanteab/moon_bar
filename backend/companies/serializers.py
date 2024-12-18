from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Company, CompanyUser
from api.models import User
from api.serializers import UserSerializer

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'business_name', 'rut', 'email', 'phone',
            'address', 'is_active', 'created_at', 'updated_at',
            'logo', 'website', 'description'
        ]

class CompanyUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    company = CompanySerializer(read_only=True)
    
    class Meta:
        model = CompanyUser
        fields = [
            'id', 'user', 'username', 'full_name', 'company', 'role',
            'is_company_admin', 'is_active', 'created_at'
        ]
    
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()

class CompanyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Obtener grupos del usuario
        user_groups = [group.name for group in self.user.groups.all()]
        
        user_data = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'is_superuser': self.user.is_superuser,
            'is_system_admin': self.user.is_system_admin,
            'groups': user_groups,  # Añadir grupos
        }
        
        user_companies = CompanyUser.objects.filter(
            user=self.user,
            is_active=True,
            company__is_active=True
        ).select_related('company')
        
        companies_data = []
        for cu in user_companies:
            company_data = {
                'id': cu.company.id,
                'name': cu.company.name,
                'business_name': cu.company.business_name,
                'rut': cu.company.rut,
                'email': cu.company.email,
                'phone': cu.company.phone,
                'address': cu.company.address,
                'is_active': cu.company.is_active,
                'website': cu.company.website,
                'description': cu.company.description,
                'created_at': cu.company.created_at.isoformat() if cu.company.created_at else None,
                'updated_at': cu.company.updated_at.isoformat() if cu.company.updated_at else None,
                'role': cu.role,
                'is_admin': cu.is_company_admin
            }
            companies_data.append(company_data)

        data['user'] = user_data
        data['companies'] = companies_data
        
        return data