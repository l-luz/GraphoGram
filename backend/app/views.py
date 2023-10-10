from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from app.serializers import *
from app.models import *
from rest_framework.decorators import action

# Create your views here.
class HomeView(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        content = {'message': 'Welcome to the JWT Authentication page using React Js and Django!'}
        return Response(content)



class DiagramaView(viewsets.ModelViewSet):
    serializer_class = SerializadorDiagrama
    queryset = Diagrama.objects.all()
    permission_classes = [IsAuthenticated]

class PastaView(viewsets.ModelViewSet):
    serializer_class = SerializadorPasta
    queryset = Pasta.objects.all()
    permission_classes = [IsAuthenticated]

    @action(detail=False)
    def pastas(self, atual):
        pastasfilhas = Pasta.objects.filter(descendente=atual)
        serializer = self.get_serializer(pastasfilhas, many=True)
        return Response(serializer.data)

    # def list(self, request):
        # usuario = None
        # user = None
        # request = self.context.get("request")
        # if request and hasattr(request, "user"):
        #     usuario = request.user
        # print(usuario)

        # output = [{"nome": output.nome, "dono":"laee"} for output in Pasta.objects.all()]
        # return Response(output)

    # def get(self, request, pk):
    #     output = [{"nome": output.nome, "dono":output.dono} for output in Pasta.objects.filter(id=pk)]
    #     return Response(output)

class TurmaView(viewsets.ModelViewSet):
    serializer_class = SerializadorTurma
    queryset = Turma.objects.all()
    # permission_classes = [IsAuthenticated]

    # @action(detail=False, methods=['get'])
    # def listar_disciplinas(request):
    #     queryset = Disciplina.objects.all()
    #     serializer = SerializadorDisciplina(queryset, many=True)
    #     return Response(serializer.data)
class DisciplinaView(viewsets.ModelViewSet):
    serializer_class = SerializadorDisciplina
    queryset = Disciplina.objects.all()
    # permission_classes = [IsAuthenticated]


class UsuarioView(viewsets.ModelViewSet):
    serializer_class = SerializadorUsuario
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
