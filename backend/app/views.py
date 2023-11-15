from django.shortcuts import get_object_or_404, render
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from django.db import transaction as db_transaction
from logger.models import LogEvents
from logger.functions import log_event

from app.serializers import *
from app.models import *
from rest_framework.decorators import action
import pandas as pd
# Create your views here.

class DiagramaView(viewsets.ModelViewSet):
    serializer_class = SerializadorDiagrama
    queryset = Diagrama.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def create(self, request):
        usuario = request.user.id
        if request.method == 'POST':
            data_diagrama = request.data
            data_diagrama["dono"] = usuario 
            data_diagrama["pasta"] = None
            serializer_diagrama = SerializadorDiagrama(data=data_diagrama)
            erros = []
            try:
                with db_transaction.atomic():
                    if serializer_diagrama.is_valid():
                        serializer_diagrama.save()
                        data_gerencia = {
                            "diagrama": serializer_diagrama.data["id"],
                            "criador": usuario
                        }
                        serializer_gerencia = SerializadorGerencia(data=data_gerencia)
                        if serializer_gerencia.is_valid():
                            serializer_gerencia.save()
                            log_event(
                                request,
                                LogEvents.DIAGRAMA_CREATED,
                                user=request.user
                            )
                        else:
                            erros.append(serializer_gerencia.errors)
                            raise Exception()
                        return Response(serializer_diagrama.data, status=status.HTTP_201_CREATED)
                    else:
                        erros.append(serializer_diagrama.errors)
                        raise Exception
            except Exception as e:
                print("Erros:", erros)
                return Response(erros, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        diagrama_objeto = get_object_or_404(Diagrama, pk=pk)
        data_diagrama = request.data
        print(data_diagrama)

        serializer_diagrama = SerializadorDiagrama(instance=diagrama_objeto, data=data_diagrama, partial=True)
        erros = []

        try:
            with db_transaction.atomic():
                if serializer_diagrama.is_valid():
                    serializer_diagrama.save()
                    log_event(
                            request,
                            LogEvents.DIAGRAMA_CHANGED,
                            user=request.user
                        )
                    return Response(serializer_diagrama.data, status=status.HTTP_200_OK)
                else:
                    erros.append(serializer_diagrama.errors)
                    raise Exception()
        except Exception as e:
            print("Erro:", str(e))
            return Response(erros, status=status.HTTP_400_BAD_REQUEST)

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
        gerencia = Gerencia.objects.filter(criador=usuario).values_list('diagrama', flat=True)
        diagramasfilhos = Diagrama.objects.filter(pasta=pk, id__in=gerencia)

        serializador_pasta = SerializadorPasta(pastasfilhas, many=True)
        serializador_diagrama = [{'titulo':d.titulo, 'id':d.id, 'dt_criacao':d.dt_criacao} for d in diagramasfilhos]
        # print( serializador_diagrama)
        # TODO: criar um json com os dados a serem mostrados (imagem, titulo, id, dt_criacao)
        log_event(
            request,
            LogEvents.PASTA_ACCESSED,
            user=request.user
        )
        return Response({
            'pastas': serializador_pasta.data,
            'diagramas': serializador_diagrama
        })

    def create(self, request):
        usuario = request.user.id
        if request.method == 'POST':
            data = request.data  # Use request.data em vez de request.data.copy()
            data["dono"] = usuario  # Adiciona o ID do usuário aos dados
            serializer_pasta = SerializadorPasta(data=data)
            print(data)
            # pass
            if serializer_pasta.is_valid():
                serializer_pasta.save()
                return Response(serializer_pasta.data, status=status.HTTP_201_CREATED)
            print(serializer_pasta.errors)  # Imprime os erros de validação no console
            return Response(serializer_pasta.errors, status=status.HTTP_400_BAD_REQUEST)


class TurmaView(viewsets.ModelViewSet):
    serializer_class = SerializadorTurma
    queryset = Turma.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def create(self, request):
        data_turma = request.data
        file = data_turma.pop("alunos_excel")

        serializer_turma = SerializadorTurma(data=data_turma)
        erros = []
        try:
            with db_transaction.atomic():
                lista_alunos = pd.read_excel("exemplo_lista_alunos.XLSX", header=8)
                lista_alunos = lista_alunos.loc[:, ['Matrícula', 'Nome']] 
                lista_alunos['Nome'] = lista_alunos['Nome'].astype(str).str.replace(r'\n[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+', '', regex=True)

                if serializer_turma.is_valid():
                    serializer_turma.save()
                    log_event(
                            request,
                            LogEvents.DIAGRAMA_CHANGED,
                            user=request.user
                        )
                    for linha in lista_alunos:
                        data_aluno = {
                            "tipo": "aluno",
                            "username": linha.matricula,
                            "nome": linha.nome,
                        }
                        serializer_aluno = SerializadorUsuario(data=data_aluno)
                        data_participa = {
                            "turma": serializer_turma.data["id"],
                            "aluno":serializer_aluno.data["id"]
                        }
                        serializer_participa = SerializadorParticipa(data=data_participa)

                        if (serializer_aluno.is_valid() and serializer_participa.is_valid() and serializer_turma.is_valid()):
                            serializer_aluno.save()
                            serializer_participa.save()
                            serializer_turma.save()
                            return Response(serializer_turma.data, status=status.HTTP_200_OK)
                else:
                    erros.append(serializer_turma.errors)
                    raise Exception()
        except Exception as e:
            print("Erro:", str(e))
            return Response(erros, status=status.HTTP_400_BAD_REQUEST)

 
    def list(self, request):
        """
            Lista as pastas do usuário de acordo com o nível
        """
        
        usuario = request.user.id

        turmas = Turma.objects.filter(responsavel=usuario)
        participa = Participa.objects.filter(turma__in=turmas).prefetch_related("turma")

        serialiador_participa = SerializadorParticipa(participa, many=True)
        print( serialiador_participa)
        # TODO: criar um json com os dados a serem mostrados (imagem, titulo, id, dt_criacao)

        return Response({
            'turmas': serialiador_participa.data,
        })

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

