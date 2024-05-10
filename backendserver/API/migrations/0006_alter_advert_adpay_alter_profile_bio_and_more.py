# Generated by Django 5.0.2 on 2024-04-09 16:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0005_advert_adowner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advert',
            name='AdPay',
            field=models.DecimalField(decimal_places=2, max_digits=13),
        ),
        migrations.AlterField(
            model_name='profile',
            name='bio',
            field=models.CharField(default='', max_length=400),
        ),
        migrations.AlterField(
            model_name='profile',
            name='picture',
            field=models.ImageField(default='default.jpg', upload_to='SystemPics'),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=100),
        ),
    ]
