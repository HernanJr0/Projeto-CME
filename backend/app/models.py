from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('tecnico', 'Técnico'),
        ('enfermeiro', 'Enfermeiro'),
        ('administrativo', 'Administrativo'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='tecnico')

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = 'administrativo'
        super().save(*args, **kwargs)
