# Generated by Django 5.0.6 on 2025-01-28 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='history',
            name='failure_count',
            field=models.IntegerField(default=0),
        ),
    ]
