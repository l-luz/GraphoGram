# Generated by Django 4.0 on 2023-12-09 20:20

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_remove_user_tipo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='acessodiagrama',
            name='dt_ini_vis',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]
