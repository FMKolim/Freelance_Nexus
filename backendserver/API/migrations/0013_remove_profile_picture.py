# Generated by Django 5.0.2 on 2024-04-20 13:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0012_deadlines'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='picture',
        ),
    ]