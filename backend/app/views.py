from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response

from app.serializers import SerializadorDiagrama, SerializadorPasta, SerializadorUsuario
from app.models import Diagrama, User,Pasta
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class DiagramaView(viewsets.ModelViewSet):
    serializer_class = SerializadorDiagrama
    queryset = Diagrama.objects.all()
    permission_classes = [IsAuthenticated]

class PastaView(viewsets.ModelViewSet):
    serializer_class = SerializadorPasta
    queryset = Pasta.objects.all()
    permission_classes = [IsAuthenticated]

    def list(self, request):
        # usuario = None
        # user = None
        # request = self.context.get("request")
        # if request and hasattr(request, "user"):
        #     usuario = request.user
        # print(usuario)

        output = [{"nome": output.nome, "dono":"laee"} for output in Pasta.objects.all()]
        return Response(output)

    # def get(self, request, pk):
    #     output = [{"nome": output.nome, "dono":output.dono} for output in Pasta.objects.filter(id=pk)]
    #     return Response(output)

class UsuarioView(viewsets.ModelViewSet):
    serializer_class = SerializadorUsuario
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
