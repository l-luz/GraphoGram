from django.db import models
from django.utils import timezone as tz
from datetime import timedelta as td
from django.contrib.auth.models import AbstractUser
from dateutil.relativedelta import relativedelta as rd


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    
    # tipo = models.CharField(max_length=30, default="aluno") # groups do django
    username = models.CharField(max_length=40, unique=True) # matricula
    email = models.EmailField(unique=True, blank=True, null=True)
    nome = models.CharField(max_length=500)

    def get_nome(self):
        return self.nome.split(' ')[0]
    
    class Meta:
        db_table = "Usuario"


class Disciplina(models.Model):
    id = models.AutoField(primary_key=True)
    
    codigo = models.CharField(max_length=30, unique=True, blank=False, null=False)
    nome = models.CharField(max_length=100)
    depto = models.CharField(max_length=30)

    class Meta:
        db_table = "Disciplina"


class Turma(models.Model):
    id = models.AutoField(primary_key=True)
    disciplina = models.ForeignKey("Disciplina", db_column="fk_disciplina_id", on_delete=models.CASCADE)
    ano = models.IntegerField()
    periodo = models.IntegerField()
    responsavel = models.ForeignKey("User", related_name="Professor", db_column="fk_usuario_id", on_delete=models.CASCADE)
    codigo = models.CharField(max_length=300, default="3wa")

    def __str__(self):
        return self.codigo + " - " + self.periodo

    class Meta:
        db_table = "Turma"

class Participa(models.Model):
    id = models.AutoField(primary_key=True)
    turma = models.ForeignKey("Turma", db_column="fk_turma_id", on_delete=models.CASCADE)
    aluno = models.ForeignKey("User", db_column="fk_aluno_id", on_delete=models.CASCADE)

    class Meta:
        db_table = "Participa"
        verbose_name_plural = "participantes"


class Pasta(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    descendente = models.ForeignKey("self", db_column="fk_pasta_id", on_delete=models.SET_NULL, blank=True, null=True)
    dono = models.ForeignKey("User", db_column="fk_usuario_id", on_delete=models.CASCADE)

    class Meta:
        db_table = "Pasta"


class Diagrama(models.Model):
    id = models.AutoField(primary_key=True)
    
    estrutura = models.JSONField() # excalidraw json
    etapas = models.JSONField() # cytoscape
    descricao = models.CharField(max_length=500, blank=True, null=True)
    titulo = models.CharField(max_length=100, blank=True, null=True)
    pasta = models.ForeignKey("Pasta", db_column="fk_pasta_id", on_delete=models.CASCADE, null=True, blank=True)
    dt_criacao = models.DateField(auto_now_add=True)
    num_etapas = models.IntegerField(default=1)
    num_pergs = models.IntegerField(default=0)
    class Meta:
        db_table = "Diagrama"


class AcessoDiagrama(models.Model):
    id = models.AutoField(primary_key=True)
    
    diagrama = models.ForeignKey("Diagrama", db_column="fk_diagrama_id", on_delete=models.CASCADE, null=True, blank=True)
    turma = models.ForeignKey("Turma", db_column="fk_turma_id", on_delete=models.CASCADE, null=True, blank=True)
    dt_ini_vis = models.DateTimeField(default=tz.now)

    def default_dt_fim_vis():
        return tz.now() + rd(months=6)

    dt_fim_vis = models.DateTimeField(default=default_dt_fim_vis)

    class Meta:
        db_table = "Visualiza"


class AcessoPasta(models.Model):
    id = models.AutoField(primary_key=True)
    
    turma = models.ForeignKey("Turma", db_column="fk_turma_id", on_delete=models.CASCADE)
    pasta = models.ForeignKey("Pasta", db_column="fk_pasta_id", on_delete=models.CASCADE)

    class Meta:
        db_table = "Acessa"


class Gerencia(models.Model):
    id = models.AutoField(primary_key=True)
    
    diagrama = models.ForeignKey("Diagrama", db_column="fk_diagrama_id", on_delete=models.CASCADE)
    criador = models.ForeignKey("User", db_column="fk_usuario_id", on_delete=models.CASCADE)

    class Meta:
        db_table = "Gerencia"

