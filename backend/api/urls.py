from django.urls import path
from .views import *

urlpatterns = [
    # Log de usuarios
    path('api/users/activity-logs/', get_user_logs, name='user-activity-logs'),
    
    # Grupos de usuarios 
    path('api/groups/create/', create_group, name='create-group'),
    path('api/groups/<int:id>/update/', update_group, name='update-group'),
    path('api/groups/<int:id>/delete/', delete_group, name='delete-group'),
    path('api/groups/', get_groups, name='get-groups'),
    
    # Users
    path('api/users/', user_list, name='user-list'),  # Agregado el nombre
    path('api/users/me/', current_user, name='current-user'),
    path('api/users/change-password/', change_password, name='change-password'),
    path('api/users/manage/', manage_users, name='manage-users'),
    path('api/users/create/', create_user, name='create-user'),
    path('api/users/<int:id>/update/', update_user, name='update-user'),
    path('api/users/<int:id>/get-user/', get_user, name='get-user'),
    path('api/users/<int:id>/delete/', delete_user, name='delete-user'),
    
    # Companies 
    path('api/users/<int:user_id>/companies/', get_user_companies, name='user-companies'),
]