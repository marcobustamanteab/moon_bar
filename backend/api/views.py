from django.shortcuts import render

from django.contrib.auth.models import User, Group
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.forms.models import model_to_dict
from api.serializers import UserSerializer
from rest_framework import status, generics
from django.contrib.auth.hashers import check_password
from .models import UserActivityLog
from .serializers import GroupSerializer, UserActivityLogSerializer
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current_password = request.data.get('currentPassword')
    new_password = request.data.get('newPassword')
    
    if not check_password(current_password, user.password):
        # Registrar el intento fallido de cambio de contraseña
        log_user_activity(
            user=user,
            activity_type='password_change_failed',
            details='Intento fallido de cambio de contraseña - Contraseña actual incorrecta',
            request=request
        )
        return Response(
            {"detail": "La contraseña actual es incorrecta"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user.set_password(new_password)
        user.save()
        
        # Registrar el cambio exitoso de contraseña
        log_user_activity(
            user=user,
            activity_type='password_change',
            details='Cambio de contraseña realizado exitosamente',
            request=request
        )
        
        return Response({"detail": "Contraseña actualizada exitosamente"})
    except Exception as e:
        # Registrar el error en el cambio de contraseña
        log_user_activity(
            user=user,
            activity_type='password_change_error',
            details=f'Error al cambiar la contraseña: {str(e)}',
            request=request
        )
        return Response(
            {"detail": "Error al actualizar la contraseña"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


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
            # Registrar la actividad después de crear exitosamente el usuario
            log_user_activity(
                user=request.user,  # usuario que realiza la acción
                activity_type='user_created',
                details=f'Usuario creado: {user.username}',
                request=request
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"detail": "Error al crear el usuario: " + str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
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
    

# Log de usuarios
@api_view(['GET', 'POST']) 
@permission_classes([IsAuthenticated])
def get_user_logs(request):
    if request.method == 'GET':
        days = request.query_params.get('days', 7)
        activity_type = request.query_params.get('activity_type', None)
        username = request.query_params.get('username', None)
        
        since = timezone.now() - timedelta(days=int(days))
        logs = UserActivityLog.objects.filter(timestamp__gte=since)
        
        if activity_type:
            logs = logs.filter(activity_type=activity_type)
        if username:
            logs = logs.filter(user__username=username)
        
        serializer = UserActivityLogSerializer(logs, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        try:
            user = User.objects.get(username=request.data.get('username'))
            log = UserActivityLog.objects.create(
                user=user,
                activity_type=request.data.get('activity_type'),
                details=request.data.get('details'),
                ip_address=get_client_ip(request)
            )
            serializer = UserActivityLogSerializer(log)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

def log_user_activity(user, activity_type, details, request):
    """Función auxiliar para registrar actividad"""
    UserActivityLog.objects.create(
        user=user,
        activity_type=activity_type,
        details=details,
        ip_address=get_client_ip(request)
    )

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_group(request):
    name = request.data.get('name')
    if not name:
        return Response(
            {"detail": "El nombre del grupo es requerido"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        group = Group.objects.create(name=name)
        log_user_activity(
            user=request.user,
            activity_type='group_created',
            details=f'Grupo creado: {name}',
            request=request
        )
        return Response({
            "id": group.id,
            "name": group.name
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response(
            {"detail": f"Error al crear el grupo: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_group(request, id):
    try:
        group = Group.objects.get(id=id)
        name = request.data.get('name')
        if not name:
            return Response(
                {"detail": "El nombre del grupo es requerido"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        group.name = name
        group.save()
        
        log_user_activity(
            user=request.user,
            activity_type='group_updated',
            details=f'Grupo actualizado: {name}',
            request=request
        )
        
        return Response({
            "id": group.id,
            "name": group.name
        })
    except Group.DoesNotExist:
        return Response(
            {"detail": "Grupo no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"detail": f"Error al actualizar el grupo: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_group(request, id):
    try:
        group = Group.objects.get(id=id)
        name = group.name
        group.delete()
        
        log_user_activity(
            user=request.user,
            activity_type='group_deleted',
            details=f'Grupo eliminado: {name}',
            request=request
        )
        
        return Response({"detail": "Grupo eliminado exitosamente"})
    except Group.DoesNotExist:
        return Response(
            {"detail": "Grupo no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_groups(request):
    groups = Group.objects.annotate(user_count=Count('user'))
    return Response([{
        'id': group.id, 
        'name': group.name,
        'user_count': group.user_count
    } for group in groups])