from rest_framework import serializers
from django.contrib.auth.models import User, Group

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined', 'groups', 'password']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def create(self, validated_data):
        # Extraer grupos
        groups = validated_data.pop('groups', [])

        # Extraer contraseña
        password = validated_data.pop('password', None)

        # Crear el usuario
        user = User.objects.create_user(
            **validated_data
        )

        # Establecer la contraseña
        if password:
            user.set_password(password)
            user.save()

        # Asignar grupos
        if groups:
            user.groups.set(groups)

        print(f"Usuario creado: {user.username}")
        print(f"¿Tiene contraseña?: {user.has_usable_password()}")

        return user
        
    def update(self, instance, validated_data):
        groups_data = validated_data.pop('groups', None)
        user = super().update(instance, validated_data)
        
        if groups_data is not None:
            user.groups.clear()
            for group_name in groups_data:
                group = Group.objects.get(name=group_name)
                user.groups.add(group)
        return user
    
    
    def validate_username(self, value):
        user = self.instance  # usuario actual en caso de update
        if User.objects.exclude(pk=user.pk if user else None).filter(username=value).exists():
            raise serializers.ValidationError('El nombre de usuario ya existe')
        return value

    def validate_email(self, value):
        user = self.instance  # usuario actual en caso de update
        if User.objects.exclude(pk=user.pk if user else None).filter(email=value).exists():
            raise serializers.ValidationError('El email ya está en uso')
        return value
    
    def get_groups(self, obj):
            return [group.name for group in obj.groups.all()]                                                           
        
