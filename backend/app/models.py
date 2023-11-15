from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    
    tipo = models.CharField(max_length=30, default="aluno")
    username = models.CharField(max_length=40, unique=True) # matricula
    email = models.EmailField( unique=True)
    nome = models.CharField(max_length=500)
    class Meta:
        db_table = "usuario"


class Disciplina(models.Model):
    id = models.AutoField(primary_key=True)
    
    codigo = models.CharField(max_length=30)
    nome = models.CharField(max_length=100)

    class Meta:
        db_table = "disciplina"


class Turma(models.Model):
    id = models.AutoField(primary_key=True)
    # disciplina = models.ForeignKey("Disciplina", db_column="fk_turma_id", on_delete=models.CASCADE)
    disciplina = models.CharField(max_length=20)
    ano = models.IntegerField()
    periodo = models.IntegerField()
    responsavel = models.ForeignKey("User", related_name="Professor", db_column="fk_usuario_id", on_delete=models.CASCADE)
    codigo = models.CharField(max_length=300, default="3wa")
    # alunos = models.ManyToManyField("User", related_name="Alunos", db_column="fk_aluno_id")
    def __str__(self):
        return self.codigo + " - " + self.periodo

    class Meta:
        db_table = "Turma"
        order_with_respect_to = "periodo"

class Participa(models.Model):
    id = models.AutoField(primary_key=True)
    turma = models.ForeignKey("Turma", db_column="fk_turma_id", on_delete=models.CASCADE, blank=True, null=True)
    aluno = models.ForeignKey("User", db_column="fk_aluno_id", on_delete=models.CASCADE, blank=True, null=True)

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

class AcessoPasta(models.Model):
    id = models.AutoField(primary_key=True)
    
    turma = models.ForeignKey("Turma", db_column="fk_turma_id", on_delete=models.CASCADE)
    pasta = models.ForeignKey("Pasta", db_column="fk_pasta_id", on_delete=models.CASCADE)
    dt_atribuicao = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "Acessa"
        order_with_respect_to = "dt_atribuicao"


class AcessoDiagrama(models.Model):
    id = models.AutoField(primary_key=True)
    
    dt_exibicao = models.DateField()
    diagrama = models.ForeignKey("Diagrama", db_column="fk_diagrama_id", on_delete=models.CASCADE, null=True, blank=True)
    turma = models.ForeignKey("Turma", db_column="fk_turma_id", on_delete=models.CASCADE, null=True, blank=True)
    class Meta:
        db_table = "Visualiza"
        order_with_respect_to = "diagrama"


class Diagrama(models.Model):
    id = models.AutoField(primary_key=True)
    
    estrutura = models.JSONField() # excalidraw json
    etapas = models.JSONField() # cytoscape
    descricao = models.CharField(max_length=500, blank=True, null=True)
    titulo = models.CharField(max_length=100, blank=True, null=True)
    pasta = models.ForeignKey("Pasta", db_column="fk_pasta_id", on_delete=models.CASCADE, null=True, blank=True)
    dt_criacao = models.DateField(auto_now_add=True)
    caminho = models.CharField(max_length=100, blank=True, null=True)
    num_etapas = models.IntegerField(default=1)
    num_pergs = models.IntegerField(default=0)
    
    class Meta:
        db_table = "Diagrama"


class Gerencia(models.Model):
    id = models.AutoField(primary_key=True)
    
    dt_alteracao = models.DateField(auto_now_add=True) # dt -> Todo datetime + hora
    diagrama = models.ForeignKey("Diagrama", db_column="fk_diagrama_id", on_delete=models.CASCADE)
    criador = models.ForeignKey("User", db_column="fk_usuario_id", on_delete=models.CASCADE)

    class Meta:
        db_table = "Gerencia"
        ordering = ["-dt_alteracao"]

