from django.db import models
from django.conf import settings

class Company(models.Model):
    name = models.CharField(max_length=100)
    business_name = models.CharField(max_length=100)  # Razón social
    rut = models.CharField(max_length=20, unique=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='CompanyUser',
        related_name='companies'
    )
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    website = models.URLField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Company"
        verbose_name_plural = "Companies"
        ordering = ['name']

    def __str__(self):
        return self.name

class CompanyUser(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('manager', 'Gerente'),
        ('staff', 'Personal'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='company_users'
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='company_users'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='staff')
    is_company_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'company']
        ordering = ['company', 'user__username']

    def __str__(self):
        return f"{self.user.username} - {self.company.name} ({self.get_role_display()})"