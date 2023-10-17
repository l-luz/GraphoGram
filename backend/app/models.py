from django.db import models
from django.contrib.auth.models import AbstractUser

class Todo(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    
    papel = models.CharField(max_length=30, default="aluno")
    username = models.CharField(max_length=40, unique=True)
    email = models.EmailField( unique=True)
    nome = models.CharField(max_length=500)
    matricula = models.CharField(max_length=10, unique=True)
    # exibicao = models.ForeignKey("Exibicao", db_column="fk_exibicao_id", on_delete=models.SET_NULL, null=True, blank=True)

    fonte = models.CharField(max_length=100, null=True, blank=True)
    tamanho_fonte = models.FloatField(null=True, blank=True)
    class Meta:
        db_table = "usuario"


# class Exibicao(models.Model):
#     id = models.AutoField(primary_key=True)
    
#     class Meta:
#         verbose_name_plural = "Exibições"
#         verbose_name = "Exibição"
#         db_table = "exibicao"


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
    responsavel = models.ForeignKey("User", related_name="Professor", db_column="fk_user_id", on_delete=models.CASCADE)
    codigo = models.CharField(max_length=300, default="3wa")
    alunos = models.ManyToManyField("User", related_name="Alunos", db_column="fk_aluno_id")
    def __str__(self):
        return self.codigo + " - " + self.periodo

    class Meta:
        db_table = "turma"
        order_with_respect_to = "periodo"


class Pasta(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    descendente = models.ForeignKey("self", db_column="fk_pasta_id", on_delete=models.SET_NULL, blank=True, null=True)
    dono = models.ForeignKey("User", db_column="fk_user_id", on_delete=models.CASCADE)
    class Meta:
        db_table = "pasta"

class AcessoPasta(models.Model):
    id = models.AutoField(primary_key=True)
    
    turma = models.ForeignKey("Turma", db_column="fk_turma_id", on_delete=models.CASCADE)
    pasta = models.ForeignKey("Pasta", db_column="fk_pasta_id", on_delete=models.CASCADE)
    dt_atribuicao = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "acessoPasta"
        order_with_respect_to = "dt_atribuicao"


class AcessoDiagrama(models.Model):
    id = models.AutoField(primary_key=True)
    
    dt_exibicao = models.DateField()
    diagrama = models.ForeignKey("Diagrama", db_column="fk_diagrama_id", on_delete=models.CASCADE)

    class Meta:
        db_table = "acessoDiagrama"
        order_with_respect_to = "diagrama"


class Diagrama(models.Model):
    id = models.AutoField(primary_key=True)
    
    criador = models.ForeignKey("User", db_column="fk_user_id", on_delete=models.CASCADE)
    estrutura = models.JSONField() # excalidraw json
    etapas = models.JSONField()
    # link = models.CharField(max_length=1000)
    descricao = models.CharField(max_length=500, blank=True, null=True)
    titulo = models.CharField(max_length=100)
    pasta = models.ForeignKey("Pasta", db_column="fk_pasta_id", on_delete=models.CASCADE, null=True, blank=True)
    dt_criacao = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "diagrama"

class Imagem(models.Model):
    id = models.AutoField(primary_key=True)

    document = models.BinaryField(blank=True, editable=True)
    document_path = models.CharField(max_length=300, blank=True)
    diagrama = models.ForeignKey("Diagrama", db_column="fk_diagrama_id", on_delete=models.CASCADE)
    
    class Meta:
        db_table = "imagem"
        order_with_respect_to = "diagrama"


class Alteracao(models.Model):
    id = models.AutoField(primary_key=True)
    
    dt_alteracao = models.DateField(auto_now_add=True)
    tipo = models.CharField(max_length=100)
    diagrama = models.ForeignKey("Diagrama", db_column="fk_diagrama_id", on_delete=models.CASCADE)
    
    class Meta:
        db_table = "alteracao"
        ordering = ["-dt_alteracao"]

