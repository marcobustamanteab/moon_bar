from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Company, CompanyModule, CompanyUser
from django.contrib.auth.models import User

class CompanyModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyModule
        fields = ['id', 'name', 'is_active', 'config', 'expiration_date']

class CompanySerializer(serializers.ModelSerializer):
    modules = CompanyModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'business_name', 'rut', 'email', 'phone', 
                 'address', 'is_active', 'created_at', 'updated_at', 
                 'logo', 'website', 'description', 'modules']

class CompanyUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CompanyUser
        fields = ['id', 'user', 'username', 'full_name', 'company', 'role', 
                 'is_company_admin', 'is_active', 'created_at']
    
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()
    
    
class CompanyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Debug logs
        print("=== DEBUG LOGIN ===")
        print(f"Usuario: {self.user.username}")
        print(f"Es superusuario: {self.user.is_superuser}")
        
        # Agregar información del usuario
        user_data = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'is_superuser': self.user.is_superuser,
        }
        
        # Obtener las empresas del usuario
        user_companies = CompanyUser.objects.filter(
            user=self.user,
            is_active=True,
            company__is_active=True
        ).select_related('company')
        
        print("CompanyUsers encontrados:", user_companies.count())
        
        companies_data = []
        for cu in user_companies:
            # Convertir módulos a un formato serializable
            modules = []
            for module in cu.company.modules.filter(is_active=True):
                print(f"Empresa: {cu.company.name}")
                print(f"Rol: {cu.role}")
                print(f"Es admin de empresa: {cu.is_company_admin}")
                module_data = {
                    'id': module.id,
                    'name': module.name,
                    'is_active': module.is_active,
                    'config': module.config,
                    'expiration_date': module.expiration_date.isoformat() if module.expiration_date else None
                }
                modules.append(module_data)
            
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
                'is_admin': cu.is_company_admin,
                'modules': modules
            }
            companies_data.append(company_data)
            print(f"Empresa procesada: {company_data}")

        # Agregar empresas al usuario
        user_data['companies'] = companies_data
        
        # Actualizar datos de usuario en el token
        data['user'] = user_data
        data['companies'] = companies_data
        
        # print("Data final:", data)
        
        return data
    


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class CompanyUserSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only=True)
    company = CompanySerializer(read_only=True)

    class Meta:
        model = CompanyUser
        fields = [
            'id', 
            'user', 
            'company', 
            'role', 
            'is_company_admin', 
            'is_active', 
            'created_at'
        ]