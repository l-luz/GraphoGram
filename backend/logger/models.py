from django.db import models
from app.models import User


class LogEvents(models.IntegerChoices):
    USER_LOGGED_IN = 1, 'Usuário conectado'
    USER_LOGGED_OUT = 2, 'Usuário desconectado'
    USER_LOGIN_FAILED = 3, 'O usuário não consegue se conectar'
    
    DIAGRAMA_CREATED = 4, 'O diagrama foi modificado'
    DIAGRAMA_VISUALIZED = 5, 'O diagrama foi visualizado por um aluno'
    DIAGRAMA_ACCESSED = 6, 'O diagrama foi acessado por um professor'
    DIAGRAMA_CHANGED = 7, 'O diagrama foi modificado'
    DIAGRAMA_DELETED = 8, 'O diagrama deletado'

    PASTA_CREATED = 9, 'A pasta foi criada'
    PASTA_ACCESSED = 10, 'A pasta foi acessada por um aluno' # Por alunos
    PASTA_DELETED = 11, 'A pasta foi criada'
    
    TURMA_CREATED = 12, 'Uma turma foi criada'
    TURMA_DELETED = 13, 'Uma turma foi apagada'

    ALUNO_ADDED = 14, 'Alunos foram adicionados a uma turma'
    ALUNO_REMOVED = 15, 'Alunos foram removidos de uma turma'
    ALUNO_CREATED = 16, 'Alunos foram adicionados no sistema'
    ALUNO_DELETED = 17, 'Alunos foram removidos do sistema'

    DIAG_PERM_ADDED = 18, 'Permissões concedidas a uma turma'
    DIAG_PERM_REMOVED = 19, 'Permissões removidas de uma turma'

# py manage.py makemigrations logger
class Log(models.Model):
    id = models.AutoField(primary_key=True)
    ip = models.GenericIPAddressField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    time = models.DateTimeField(auto_now_add=True)
    event = models.IntegerField(choices=LogEvents.choices)
    description = models.CharField(max_length=1000, null=True, blank=True)
    info = models.JSONField(null=True, blank=True)
