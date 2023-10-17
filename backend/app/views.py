from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView

from app.serializers import *
from app.models import *
from rest_framework.decorators import action

# Create your views here.

class DiagramaView(viewsets.ModelViewSet):
    serializer_class = SerializadorDiagrama
    queryset = Diagrama.objects.all()
    permission_classes = [JWTAuthentication]
    authentication_classes = [SessionAuthentication]

class PastaView(viewsets.ModelViewSet):
    serializer_class = SerializadorPasta
    queryset_pasta = Pasta.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def list(self, request):
        return self.retrieve(request)

    def retrieve(self, request, pk=None):
        """
            Lista as pastas do usuário de acordo com o nível
        """
        usuario = request.user.id
        pastasfilhas = Pasta.objects.filter(descendente=pk, dono=usuario)
        diagramasfilhos = Diagrama.objects.filter(pasta=pk, criador=usuario)

        serializador_pasta = SerializadorPasta(pastasfilhas, many=True)
        serializador_diagrama = [{'titulo':d.titulo, 'id':d.id, 'dt_criacao':d.dt_criacao} for d in diagramasfilhos]
        # print( serializador_diagrama)
        # TODO: criar um json com os dados a serem mostrados (imagem, titulo, id, dt_criacao)
        return Response({
            'pastas': serializador_pasta.data,
            'diagramas': serializador_diagrama
        })

    def create(self, request):
        usuario = request.user.id
        if request.method == 'POST':
            data = request.data  # Use request.data em vez de request.data.copy()
            data["dono"] = usuario  # Adiciona o ID do usuário aos dados
            serializer = SerializadorPasta(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            print(serializer.errors)  # Imprime os erros de validação no console
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TurmaView(viewsets.ModelViewSet):
    serializer_class = SerializadorTurma
    queryset = Turma.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def list(self, request):
        """
            Lista as pastas do usuário de acordo com o nível
        """
        # turmasProf = Turma.objects.filter(responsavel=request.user.id).select_related('disciplina', 'alunos')
        return Response()
        
    # def create(self, request): 

class DisciplinaView(viewsets.ModelViewSet):
    serializer_class = SerializadorDisciplina
    queryset = Disciplina.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(request, format=None):
        queryset = Disciplina.objects.all()
        serializer = SerializadorDisciplina(queryset, many=True)

        return Response(serializer)

class UsuarioView(viewsets.ModelViewSet):
    serializer_class = SerializadorUsuario
    queryset = User.objects.all()
    permission_classes = [JWTAuthentication]

class HomeView(APIView):
    permission_classes = [JWTAuthentication]
    def get(self, request):
        content = {'message': 'Welcome to the JWT Authentication page using React Js and Django!'}
        return Response(content)

