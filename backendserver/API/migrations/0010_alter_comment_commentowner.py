# Generated by Django 5.0.2 on 2024-04-17 00:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0009_alter_comment_commentowner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='CommentOwner',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='comments_owned', to=settings.AUTH_USER_MODEL),
        ),
    ]
