# Generated by Django 4.2.11 on 2024-12-17 22:31

import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('is_system_admin', models.BooleanField(default=False, help_text='Designa si el usuario es un administrador del sistema.')),
                ('phone', models.CharField(blank=True, help_text='Número de teléfono del usuario', max_length=20, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Usuario',
                'verbose_name_plural': 'Usuarios',
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='UserActivityLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_type', models.CharField(choices=[('login', 'Inicio de sesión'), ('logout', 'Cierre de sesión'), ('password_change', 'Cambio de contraseña'), ('password_change_failed', 'Intento fallido de cambio de contraseña'), ('profile_update', 'Actualización de perfil'), ('failed_login', 'Intento fallido de inicio de sesión'), ('user_created', 'Usuario creado'), ('user_updated', 'Usuario actualizado'), ('user_deleted', 'Usuario eliminado'), ('token_validation', 'Token validado'), ('token_validation_failed', 'Token inválido'), ('profile_fetch', 'Obtención de perfil'), ('profile_fetch_failed', 'Error al obtener perfil')], max_length=50)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('details', models.TextField()),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Registro de actividad',
                'verbose_name_plural': 'Registros de actividad',
                'ordering': ['-timestamp'],
            },
        ),
    ]
