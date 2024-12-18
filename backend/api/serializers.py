from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import User, UserActivityLog

from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import User, UserActivityLog

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    groups = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'is_staff', 'is_system_admin', 'phone', 'date_joined', 
            'groups', 'password', 'is_active'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]

    def create(self, validated_data):
    # Eliminar grupos de validated_data si existe
        groups_names = self.initial_data.get('groups', [])
        print(f"Grupos a asignar: {groups_names}")
        
        # Eliminar grupos de validated_data para evitar errores
        if 'groups' in validated_data:
            del validated_data['groups']
        
        password = validated_data.pop('password', None)

        # Crear usuario
        user = User.objects.create_user(**validated_data)

        # Establecer contraseña
        if password:
            user.set_password(password)
            user.save()

        # Asignar grupos
        if groups_names:
            groups = Group.objects.filter(name__in=groups_names)
            print(f"Grupos encontrados en la base de datos: {list(groups.values_list('name', flat=True))}")
            
            if groups.exists():
                user.groups.set(groups)
                print(f"Grupos asignados finalmente: {list(user.groups.values_list('name', flat=True))}")
            else:
                print(f"No se encontraron grupos con nombres: {groups_names}")

        return user
        
    def update(self, instance, validated_data):
        groups_data = validated_data.pop('groups', None)
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if password:
            instance.set_password(password)
            
        if groups_data is not None:
            group_objects = Group.objects.filter(name__in=groups_data)
            instance.groups.clear()
            instance.groups.add(*group_objects)
                
        instance.save()
        return instance
    
    def validate_username(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk if user else None).filter(username=value).exists():
            raise serializers.ValidationError('El nombre de usuario ya existe')
        return value

    def validate_email(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk if user else None).filter(email=value).exists():
            raise serializers.ValidationError('El email ya está en uso')
        return value

class UserActivityLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserActivityLog
        fields = ['id', 'username', 'activity_type', 'timestamp', 'details', 'ip_address']
        read_only_fields = ['timestamp', 'ip_address']

class GroupSerializer(serializers.ModelSerializer):
    user_count = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'user_count']

    def get_user_count(self, obj):
        return obj.user_set.count()