# Generated by Django 4.0 on 2023-11-27 12:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('app', '0005_alter_acessodiagrama_dt_ini_vis'),
    ]

    operations = [
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('ip', models.GenericIPAddressField()),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('event', models.IntegerField(choices=[(1, 'Usuário conectado'), (2, 'Usuário desconectado'), (3, 'O usuário não consegue se conectar'), (4, 'O diagrama foi modificado'), (5, 'O diagrama foi visualizado por um aluno'), (6, 'O diagrama foi acessado por um professor'), (7, 'O diagrama foi modificado'), (8, 'O diagrama deletado'), (9, 'A pasta foi criada'), (10, 'A pasta foi acessada por um aluno'), (11, 'A pasta foi criada'), (12, 'Uma turma foi criada'), (13, 'Uma turma foi apagada'), (14, 'Alunos foram adicionados a uma turma'), (15, 'Alunos foram removidos de uma turma'), (16, 'Alunos foram adicionados no sistema'), (17, 'Alunos foram removidos do sistema'), (18, 'Permissões concedidas a uma turma'), (19, 'Permissões removidas de uma turma')])),
                ('description', models.CharField(blank=True, max_length=1000, null=True)),
                ('info', models.JSONField(blank=True, null=True)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='app.user')),
            ],
        ),
    ]
