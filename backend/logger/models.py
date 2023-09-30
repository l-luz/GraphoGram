from django.db import models
from app.models import User
from django.utils.translation import gettext_lazy as _U


# class LogEvents(models.IntegerChoices):  # TODO not logged anywhere yet
#     USER_LOGGED_IN = 1, _U('Usuário conectado')
#     USER_LOGGED_OUT = 2, _U('Usuário desconectado')
#     USER_CHANGED_PASSWORD = 3, _U('O usuário mudou de senha')
#     USER_REGISTERED = 4, _U('Usuário cadastrado')
#     USER_VALIDATED = 5, _U('Usuário validado')
#     USER_LOGIN_FAILED = 6, _U('O usuário não consegui se conectar')
#     USER_ASKED_PASSWORD_REDEFINITION = 7, _U('O usuário pediu para mudar a senha')
#     USER_REDEFINED_PASSWORD = 8, _U('Usuário mudou a senha')
#     USER_UPDATED = 9, _U('O usuário mudou suas informações')
#     USER_DELETED = 10, _U('O usuário foi deletado')
#     USER_LIST_ACCESSED = 11, _U('A lista de usuários foi acessada')
#     # USER_INFO_ACCESSED = 11, _U('As informações do usuário foram acessadas')


# class Log(models.Model):
#     id = models.AutoField(primary_key=True)
#     ip = models.GenericIPAddressField()
#     user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
#     time = models.DateTimeField(auto_now_add=True)
#     event = models.IntegerField(choices=LogEvents.choices)
#     description = models.CharField(max_length=1000, null=True)
