import base64
import io
import tempfile
from django.http import HttpResponse
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
from django.contrib.auth.hashers import make_password


from app.serializers import *
from app.models import *
from rest_framework.decorators import action
import pandas as pd

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
        # print(data_diagrama)

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
    queryset = Pasta.objects.all()
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
            data = request.data
            data["dono"] = usuario
            serializer_pasta = SerializadorPasta(data=data)

            if serializer_pasta.is_valid():
                serializer_pasta.save()
                return Response(serializer_pasta.data, status=status.HTTP_201_CREATED)
            return Response(serializer_pasta.errors, status=status.HTTP_400_BAD_REQUEST)


class TurmaView(viewsets.ModelViewSet):
    serializer_class = SerializadorTurma
    queryset = Turma.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    @action(detail=True, methods=['get'])
    def participantes(self, request, pk=None):
        if pk is not None:
            serializador_participantes = SerializadorParticipantesTurma(Participa.objects.filter(turma=pk), many=True)
            return Response({
                'participantes': serializador_participantes.data,
            })
        else:
            return Response({'error': 'ID da turma não fornecido.'}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        responsavel = request.user
        data_turma = request.data
        data_turma["responsavel"] = responsavel.id

        arquivo = request.FILES["file"].read()
        data_turma.pop('file', None)
        serializer_turma = SerializadorTurma(data=data_turma, context={"post": True})

        lista_alunos = pd.read_excel(arquivo, engine="openpyxl", header=8, usecols=["Matrícula", "Nome"])
        lista_alunos['Nome'] = lista_alunos['Nome'].astype(str).str.replace(r'\n[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+', '', regex=True)
        lista_alunos['Nome'] = lista_alunos['Nome'].astype(str).str.replace(r'\n+', '', regex=True)
        lista_alunos['Nome'] = lista_alunos['Nome'].str.strip().apply(lambda x: x.title())
        lista_alunos = lista_alunos.rename(columns={'Nome': 'nome', 'Matrícula': 'username'})
        alunos = lista_alunos.to_dict("records")

        try:
            with db_transaction.atomic():
                if serializer_turma.is_valid():
                    serializer_turma.save()
                    for data_aluno in alunos:
                        data_participa = {}
                        data_participa["turma"] = serializer_turma.data["id"]
                        try:
                            aluno_banco = User.objects.get(username=data_aluno["username"])
                            data_participa["aluno"] = aluno_banco.id
                        except User.DoesNotExist:
                            data_aluno["tipo"] = "aluno"
                            data_aluno["password"] = make_password("aluno1234")
                            serializer_aluno = SerializadorUsuario(data=data_aluno)
                            if serializer_aluno.is_valid():
                                serializer_aluno.save()
                                data_participa["aluno"] = serializer_aluno.data["id"]
                                log_event(
                                    request,
                                    LogEvents.ALUNO_CREATED,
                                    user=responsavel,
                                    info={
                                        "aluno_id": serializer_aluno.data["id"]
                                    }
                                )
                            else:
                                raise Exception("Aluno inválido", serializer_aluno.errors)

                        serializer_participa = SerializadorParticipa(data=data_participa)
                        if serializer_participa.is_valid():
                            serializer_participa.save()
                        else:
                            raise Exception("Participa inválido", serializer_participa.errors)

                        
                        log_event(
                            request,
                            LogEvents.ALUNO_ADDED,
                            user=responsavel,
                            info={
                                "participa_id": serializer_participa.data["id"]
                            }
                        )
                    log_event(
                        request,
                        LogEvents.TURMA_CREATED,
                        user=responsavel,
                        info={
                            "turma_id": serializer_turma.data["id"]
                        }
                    )
                    return Response(serializer_turma.data, status=status.HTTP_200_OK)
                else:
                    raise Exception("Turma inválida", serializer_turma.errors)
        except Exception as e:
            print("Erro:", str(e))
            return Response(e, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        """
            Retorna as turmas do usuário
        """
        
        usuario = request.user.id

        turmas = Turma.objects.filter(responsavel=usuario).select_related("disciplina")
        serializador_turma = SerializadorTurma(turmas, many=True)
        return Response({
            'turmas': serializador_turma.data,
        })

class DisciplinaView(viewsets.ModelViewSet):
    serializer_class = SerializadorDisciplina
    queryset = Disciplina.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


class ParticipaView(viewsets.ModelViewSet):
    serializer_class = SerializadorParticipa()
    queryset = Participa.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    @action(detail=False, methods=["post"])
    def create_aluno(self, request):
        if request.method == 'POST':
            data_participa = {}
            data_participa["turma"] = request.data.pop("turma_id")
            data_aluno = request.data['aluno']
            data_aluno.pop('id', None)
            data_aluno.pop('isNew', None)
            data_aluno["tipo"] = "aluno"
            data_aluno["password"] = make_password("aluno1234")

            serializer_aluno = SerializadorUsuario(data=data_aluno)

            try:
                with db_transaction.atomic():

                    try: 
                        aluno_banco = User.objects.get(username=data_aluno["username"])
                        data_participa["aluno"] = aluno_banco.id
                    except User.DoesNotExist:
                        if serializer_aluno.is_valid():
                            serializer_aluno.save()
                            data_participa["aluno"] = serializer_aluno.data["id"]
                            log_event(
                                request,
                                LogEvents.ALUNO_CREATED,
                                user=request.user,
                                info={
                                    "aluno_id": serializer_aluno.data["id"]
                                }
                            )
                        else:
                            raise Exception("Erro ao salvar o aluno.")

                    serializer_participa = SerializadorParticipa(data=data_participa)
                    try:
                        if serializer_participa.is_valid():
                            serializer_participa.save()
                        else:
                            print("erro ao salvar participante")
                            print(serializer_participa.errors)
                            raise Exception(serializer_participa.errors)
                    except Exception as e:
                        print(e)
                        raise Exception(e)

                    log_event(
                        request,
                        LogEvents.ALUNO_ADDED,
                        user=request.user,
                        info={
                            "participa_id": serializer_participa.data["id"]
                        }
                    )
                    return Response(serializer_participa.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class UsuarioView(viewsets.ModelViewSet):
    serializer_class = SerializadorUsuario
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


    @action(detail=True, methods=['put'])
    def update_participante(self, request, pk=None):
        data_aluno = request.data["aluno"]
        data_aluno["id"] = data_aluno.pop("aluno_id")

        try:
            aluno = User.objects.get(id=data_aluno["id"])
        except User.DoesNotExist:
            print({"error": "Aluno não encontrado"})
            return Response({"error": "Aluno não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        serializer_aluno = SerializadorUsuario(aluno, data=data_aluno, partial=True)
        if serializer_aluno.is_valid():
            serializer_aluno.save()
            return Response(serializer_aluno.data, status=status.HTTP_200_OK)
        print(serializer_aluno)
        print(serializer_aluno.errors)
        return Response(serializer_aluno.errors, status=status.HTTP_400_BAD_REQUEST)

