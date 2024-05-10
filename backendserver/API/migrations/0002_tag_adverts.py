# Generated by Django 5.0.2 on 2024-03-02 16:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('TagName', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Adverts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('AdTitle', models.CharField(max_length=150)),
                ('AdDesc', models.TextField()),
                ('AdPay', models.DecimalField(decimal_places=2, max_digits=6)),
                ('AdOwner', models.EmailField(max_length=254)),
                ('AdDate', models.DateTimeField(auto_now_add=True)),
                ('AdTags', models.ManyToManyField(related_name='adverts', to='API.tag')),
            ],
        ),
    ]
