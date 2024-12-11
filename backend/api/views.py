from django.shortcuts import render

from django.contrib.auth.models import User, Group
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.forms.models import model_to_dict
from api.serializers import UserSerializer
from rest_framework import status, generics
from django.contrib.auth.hashers import check_password


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current_password = request.data.get('currentPassword')
    new_password = request.data.get('newPassword')
    
    if not check_password(current_password, user.password):
        return Response(
            {"detail": "La contraseña actual es incorrecta"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.set_password(new_password)
    user.save()
    
    return Response({"detail": "Contraseña actualizada exitosamente"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    users = User.objects.all()
    user_data = []
    for user in users:
        user_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_active': user.is_active,
            'date_joined': user.date_joined,
            'groups': [group.name for group in user.groups.all()]
        })
    return Response(user_data)

# get groups 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_groups(request):
    groups = Group.objects.all()
    return Response([{'id': group.id, 'name': group.name} for group in groups])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def manage_users(request):
    """
    Vista para obtener la lista de usuarios para gestión administrativa.
    Solo accesible por usuarios admin.
    """
    users = User.objects.all().order_by('-date_joined')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"detail": "Error al crear el usuario: " + str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request, id):
    try:
        user = User.objects.get(id=id)
        serializer = UserSerializer(user)
        user_data = serializer.data
        
        # Obtener el grupo del usuario y agregarlo al serializer
        group = user.groups.first()
        if group:
            user_data['group'] = group.id
        else:
            user_data['group'] = None
        
        return Response(user_data)
    except User.DoesNotExist:
        return Response({"detail": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

# update users
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response({"detail": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# delete users
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, id):
    try:
        user = User.objects.get(id=id)
        user.delete()
        return Response({"detail": "Usuario eliminado exitosamente"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"detail": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)