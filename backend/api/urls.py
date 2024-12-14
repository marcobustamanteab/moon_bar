from django.urls import path
from .views import *

urlpatterns = [
    #log de usuarios
    path('api/users/activity-logs/', get_user_logs, name='user-activity-logs'),
    # Grupos de usuarios 
    path('api/groups/create/', create_group, name='create-group'),
    path('api/groups/<int:id>/update/', update_group, name='update-group'),
    path('api/groups/<int:id>/delete/', delete_group, name='delete-group'),
    # Users
    path('api/users/', user_list),
    path('api/users/me/', current_user, name='current-user'),
    path('api/users/change-password/', change_password, name='change-password'),
    path('api/users/manage/', manage_users, name='manage-users'),
    path('api/users/create/', create_user, name='create-user'),
    path('api/users/<int:id>/update/', update_user, name='update-user'),
    path('api/users/<int:id>/get-user/', get_user, name='get-user'),
    path('api/users/<int:id>/delete/', delete_user, name='delete-user'),
    # Groups
    path('api/groups/', get_groups, name='get-groups'),

]