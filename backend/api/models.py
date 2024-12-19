from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from companies.models import Company

class User(AbstractUser):
    is_system_admin = models.BooleanField(
        default=False,
        help_text='Designa si el usuario es un administrador del sistema.'
    )
    phone = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        help_text='Número de teléfono del usuario'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        
    def __str__(self):
        return self.username

class UserActivityLog(models.Model):
    """
    Registro de actividades de usuarios en el sistema.
    Mantiene un historial de acciones importantes.
    """
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
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='activity_logs'
    )
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='activity_logs'
    )

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Registro de actividad'
        verbose_name_plural = 'Registros de actividad'

    def __str__(self):
        return f"{self.user.username} - {self.activity_type} - {self.timestamp}"