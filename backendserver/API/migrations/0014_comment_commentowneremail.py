# Generated by Django 5.0.2 on 2024-04-21 00:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0013_remove_profile_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='CommentOwnerEmail',
            field=models.EmailField(default=None, max_length=150, null=True),
            preserve_default=False,
        ),
    ]
