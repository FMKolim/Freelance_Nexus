# Generated by Django 5.0.2 on 2024-04-18 02:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0010_alter_comment_commentowner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='CommentOwner',
            field=models.CharField(max_length=150),
        ),
    ]