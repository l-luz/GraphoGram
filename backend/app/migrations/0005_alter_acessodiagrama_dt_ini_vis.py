# Generated by Django 4.0 on 2023-11-27 12:24

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_alter_gerencia_options_remove_diagrama_caminho_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='acessodiagrama',
            name='dt_ini_vis',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]