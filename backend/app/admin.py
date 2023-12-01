from django.contrib import admin
from .models import *

class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'username')

class TurmaAdmin(admin.ModelAdmin):
    list_display = ('responsavel', 'periodo', 'disciplina')
class PastaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'descendente', 'dono')
class DiagramaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'pasta', 'dt_criacao')
class GerenciaAdmin(admin.ModelAdmin):
    list_display = ('diagrama', 'criador')

class DisciplinaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'nome')

# Register your models here.

admin.site.register(User, UsuarioAdmin)
admin.site.register(Turma, TurmaAdmin)
admin.site.register(Pasta, PastaAdmin)
admin.site.register(Diagrama, DiagramaAdmin)
admin.site.register(Gerencia, GerenciaAdmin)
admin.site.register(Disciplina, DisciplinaAdmin)
