from django.urls import path
from app import views
from django.conf.urls import include
from rest_framework import routers
from django.urls import path

router = routers.DefaultRouter()
router.register(r'diagramas', views.DiagramaView, 'diagrama')
router.register(r'pastas', views.PastaView, 'pasta')
router.register(r'usuarios', views.UsuarioView, 'usuario')
router.register(r'turmas', views.TurmaView, 'turma')
router.register(r'disciplinas', views.DisciplinaView, 'disciplina')
router.register(r'participantes', views.ParticipaView, 'participa')
router.register(r'permissoes', views.PermissoesView, 'permissoes')

urlpatterns = [
    path('api/', include(router.urls)),
]