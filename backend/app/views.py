from datetime import datetime as dt
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db import transaction as db_transaction
from logger.models import LogEvents
from logger.functions import log_event
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group

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
        usuario = request.user
        grupo = request.user.groups.first()

        if grupo == "aluno":
            turmas = Participa.objects.filter(aluno=usuario.id).select_related('turma').values_list('turma', flat=True)
            pastas = AcessoPasta.objects.filter(turma__in=turmas).select_related('pasta').values_list('pasta', flat=True)
            pastas_filhas = Pasta.objects.filter(id__in=pastas)

            serializador_pasta = SerializadorPasta(pastas_filhas, many=True)
            return Response({
                'pastas': serializador_pasta.data,
                'diagrama': []
            })
        else:
            pastas_filhas = Pasta.objects.filter(descendente=None, dono=usuario.id)
            gerencia = Gerencia.objects.filter(criador=usuario).values_list('diagrama', flat=True)
            diagramas_filhos = Diagrama.objects.filter(id__in=gerencia)

            serializador_pasta = SerializadorPasta(pastas_filhas, many=True)
            serializador_diagrama = [{'titulo':d.titulo, 'descricao': d.descricao, 'id':d.id, 'dt_criacao':d.dt_criacao} for d in diagramas_filhos]
            # print(serializador_diagrama)
            # print(serializador_pasta.data)
            return Response({
                'pastas': serializador_pasta.data,
                'diagramas': serializador_diagrama
            })

    def retrieve(self, request, pk=None):
        """
            Lista as pastas do usuário de acordo com o nível da pasta
        """

        usuario = request.user
        if (usuario.is_superuser):
            grupo = "professor"
        else:
            grupo = request.user.groups.first()

        if grupo == "aluno":
            acesso = AcessoDiagrama.objects.filter(pasta=pk, dt_fim_vis__gt=dt.today(), dt_ini_vis__lte=dt.today()).values_list("diagrama", flat=True)
            diagramas_filhos = Diagrama.objects.filter(id__in=acesso)
        else:
            if (pk):
                pastas_filhas = Pasta.objects.filter(descendente=pk, dono=usuario.id)
                gerencia = Gerencia.objects.filter(criador=usuario).values_list('diagrama', flat=True)
                has_acesso = AcessoDiagrama.objects.filter(diagrama__in=gerencia, dt_fim_vis__gt=dt.today(), dt_ini_vis__lte=dt.today()).exists()
                
                if has_acesso:
                    acesso = AcessoDiagrama.objects.filter(diagrama__in=gerencia, dt_fim_vis__gt=dt.today(), dt_ini_vis__lte=dt.today()).values_list("diagrama", flat=True)
                    diagramas_filhos = Diagrama.objects.filter(id__in=acesso)
                else:
                    diagramas_filhos = Diagrama.objects.filter(pasta=pk, id__in=gerencia)

        serializador_pasta = SerializadorPasta(pastas_filhas, many=True)
        serializador_diagrama = [{'titulo':d.titulo, 'id':d.id, 'dt_criacao':d.dt_criacao} for d in diagramas_filhos]
        log_event(
            request,
            LogEvents.PASTA_ACCESSED,
            user=usuario
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
                    data_pasta = {
                        "dono": responsavel.id,
                        "nome": str(serializer_turma.data["disciplina"]["codigo"]) + '_' + str(serializer_turma.data["codigo"]) + '_' + str(serializer_turma.data["ano"]) + '.' + str(serializer_turma.data["codigo"])
                    }
                    # Criar pasta da turma
                    serializer_pasta = SerializadorPasta(data=data_pasta)

                    if serializer_pasta.is_valid():
                        serializer_pasta.save()
                    else:
                        raise Exception("Erro ao criar pasta", serializer_pasta.errors)

                    # Associar pasta a turma
                    data_acesso_pasta = {
                        "turma": serializer_turma.data["id"],
                        "pasta": serializer_pasta.data["id"],
                    }
                    serializer_acesso_pasta = SerializadorAcessoPasta(data=data_acesso_pasta)

                    if serializer_acesso_pasta.is_valid():
                        serializer_acesso_pasta.save()
                    else:
                        raise Exception("Erro ao associar permissão de acesso", serializer_acesso_pasta.errors)

                    for data_aluno in alunos:
                        data_participa = {}
                        data_participa["turma"] = serializer_turma.data["id"]
                        try:
                            aluno_banco = User.objects.get(username=data_aluno["username"])
                            data_participa["aluno"] = aluno_banco.id
                        except User.DoesNotExist:
                            aluno_group = Group.objects.get(name='aluno')
                            data_aluno["groups"] = [aluno_group.id]
                            
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

            aluno_group = Group.objects.get(name='aluno')
            data_aluno["groups"] = [aluno_group.id]

            data_aluno["password"] = make_password("aluno1234")

            serializer_aluno = SerializadorUsuario(data=data_aluno)

            try:
                with db_transaction.atomic():

                    try: 
                        aluno_banco = User.objects.get(id=data_aluno["aluno_id"])
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
                            # print("erro ao salvar participante")
                            # print(serializer_participa.errors)
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

    @action(detail=False, methods=['get'])
    def usuario_info(self, request):
        if (request.user.is_superuser):
            user_groups = "professor"
        else:
            user_groups = request.user.groups.first()
        return Response({
            "tipo": str(user_groups),
            "nome": request.user.get_nome() or ""
        })

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
        return Response(serializer_aluno.errors, status=status.HTTP_400_BAD_REQUEST)

class PermissoesView(viewsets.ModelViewSet):
    serializer_class = SerializadorAcessoDiagrama
    queryset = AcessoDiagrama.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def retrieve(self, request, pk=None):
        usuario = request.user
        
        has_perm = AcessoDiagrama.objects.filter(turma=pk).exists()
        diagramas_perms = None
        diagramas_config = None
        gerencia = Gerencia.objects.filter(criador=usuario.id).values_list('diagrama', flat=True)
        diagramas = Diagrama.objects.filter(id__in=gerencia)
        if has_perm:
            perms_existentes = AcessoDiagrama.objects.filter(turma=pk).select_related("diagrama")
            diagramas_config = [{'id': p.id,'titulo':p.diagrama.titulo, 'diagrama_id':p.diagrama.id, 'dt_ini_vis': p.dt_ini_vis, 'dt_fim_vis': p.dt_fim_vis} for p in perms_existentes]
            diagramas_perms = perms_existentes.values_list('diagrama', flat=True)
            diagramas = diagramas.exclude(id__in=diagramas_perms)

        serializer_diagrama = [{'id': None, 'titulo':d.titulo, 'diagrama_id':d.id, 'dt_ini_vis': None, 'dt_fim_vis': None} for d in diagramas]

        # print(diagramas)
        # print(serializer_diagrama)
        # print(diagramas_config)
        return Response({
            "configurados": diagramas_config,
            "diagramas": serializer_diagrama,
        })


