from django.shortcuts import render

from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.forms.models import model_to_dict
from api.serializers import UserSerializer

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)