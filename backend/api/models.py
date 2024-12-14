from django.db import models
from django.contrib.auth.models import User

class UserActivityLog(models.Model):
    ACTIVITY_TYPES = [
        ('login', 'Inicio de sesión'),
        ('logout', 'Cierre de sesión'),
        ('password_change', 'Cambio de contraseña'),
        ('password_change_failed', 'Intento fallido de cambio de contraseña'),
        ('profile_update', 'Actualización de perfil'),
        ('failed_login', 'Intento fallido de inicio de sesión'),
        ('user_created', 'Usuario creado'),
        ('user_updated', 'Usuario actualizado'),
        ('user_deleted', 'Usuario eliminado'),
        ('token_validation', 'Token validado'),
        ('token_validation_failed', 'Token inválido'),
        ('profile_fetch', 'Obtención de perfil'),
        ('profile_fetch_failed', 'Error al obtener perfil'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs')
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)  # Hacer opcional

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} - {self.timestamp}"