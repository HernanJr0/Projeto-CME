from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

from django.core.exceptions import ValidationError

import uuid

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
    
class Material(models.Model):
    name = models.CharField(max_length=255)
    material_type = models.CharField(max_length=255)
    expiration_date = models.DateField()
    serial = models.CharField(max_length=255, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.serial:
            self.serial = f"{self.name[:3].upper()}-{uuid.uuid4().hex[:6].upper()}-{self.expiration_date}"
        super().save(*args, **kwargs)
        
        if self.expiration_date < self.created_at.date():
            raise ValidationError('Data de validade não pode ser anterior a data de hoje')
        
    def __str__(self):
        return f"{self.name} - {self.serial}"

class Process(models.Model):
    STEPS = [
        ('recebimento', 'Recebimento'),
        ('lavagem', 'Lavagem'),
        ('esterilizacao', 'Esterilização'),
        ('distribuicao', 'Distribuição'),
    ]
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name="processos")
    step = models.CharField(max_length=50, choices=STEPS)
    start_date = models.DateTimeField(auto_now_add=True)
    end_data = models.DateTimeField(null=True, blank=True)
    responsible = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.material} - {self.step}"

class Failure(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name="falhas")
    STEPS = [
        ('recebimento', 'Recebimento'),
        ('lavagem', 'Lavagem'),
        ('esterilizacao', 'Esterilização'),
        ('distribuicao', 'Distribuição'),
    ]
    step = models.CharField(max_length=50, choices=STEPS)
    description = models.TextField()
    failure_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.material} - {self.step}"

