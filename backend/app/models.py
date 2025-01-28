from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone

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
    quantity = models.IntegerField()
    step = models.CharField(max_length=50, choices=STEPS)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    responsible = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        is_update = self.pk is not None

        if not is_update:
            History.objects.create(
                user=self.responsible,
                material=self.material.name,
                material_serial=self.material.serial,
                action=f"Iniciado: {self.step.capitalize()}",
                step=self.step,
                passage_count=1
            )
        else:
            last_history = History.objects.filter(material_serial=self.material.serial, step=self.step).last()
            if last_history:
                last_history.passage_count += 1
                last_history.save()
            else:
                History.objects.create(
                    user=self.responsible,
                    material=self.material.name,
                    material_serial=self.material.serial,
                    action=f"Passagem para: {self.step.capitalize()}",
                    step=self.step,
                    passage_count=1,
                    date=timezone.now()
                )

            if self.step == 'distribuicao' and not self.end_date:
                self.end_date = timezone.now()
                History.objects.filter(
                    material_serial=self.material.serial,
                    step=self.step
                ).update(action=f"Finalizado: {self.step.capitalize()}")

        super().save(*args, **kwargs)


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

class History(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    material = models.CharField(max_length=255, blank=True)
    material_serial = models.CharField(max_length=255, blank=True)
    action = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    step = models.CharField(max_length=50, choices=Process.STEPS)
    passage_count = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.user} - {self.action}"