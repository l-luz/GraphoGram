from django.urls import path
from app import views
from django.conf.urls import include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from django.urls import path
from app.auth.views import MyObtainTokenPairView
from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter()
router.register(r'diagramas', views.DiagramaView, 'diagrama')
router.register(r'pastas', views.PastaView, 'pasta')
router.register(r'usuarios', views.UsuarioView, 'usuario')
router.register(r'turmas', views.TurmaView, 'turma')
router.register(r'disciplinas', views.DisciplinaView, 'disciplina')

print(router)

urlpatterns = [
    path('api/', include(router.urls)),
    path('home/', views.HomeView.as_view(), name ='home')
]

# urlpatterns = [
#     # path('api/todos/', views_diagrama.TodoView.as_view({'get': 'list'}), name='todo-list'),
#     # path('api/todos/<int:pk>/', views_diagrama.TodoView.as_view({'get': 'create'}), name='todo-create'),
#     # path('api/todos/<int:pk>/', views_diagrama.TodoView.as_view({'get': 'retrieve'}), name='todo-retrieve'),
#     # path('api/todos/<int:pk>/', views_diagrama.TodoView.as_view({'get': 'update'}), name='todo-update'),
#     # # # path('api/todos/<int:pk>/', views_diagrama.TodoView.as_view({'get': 'partial_update'}), name='todo-list'),
#     # path('api/todos/<int:pk>', views_diagrama.TodoView.as_view({'get': 'destroy'}), name='todo-delete'),
    
# ]

