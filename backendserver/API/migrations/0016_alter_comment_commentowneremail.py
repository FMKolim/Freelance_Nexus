# Generated by Django 5.0.2 on 2024-04-21 19:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0015_alter_comment_commentowneremail'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='CommentOwnerEmail',
            field=models.EmailField(default=None, max_length=150),
        ),
    ]