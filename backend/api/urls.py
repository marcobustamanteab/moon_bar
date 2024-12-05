from django.urls import path
from .views import *

urlpatterns = [
    path('api/users/', user_list),
    path('api/users/me/', current_user, name='current-user'),
]