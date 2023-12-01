import pandas as pd
from rest_framework import serializers
from app.models import *


class SerializadorDiagrama(serializers.ModelSerializer):
    class Meta:
        model = Diagrama
        fields = "__all__"
class SerializadorGerencia(serializers.ModelSerializer):
    class Meta:
        model = Gerencia
        fields = "__all__"

class SerializadorPasta(serializers.ModelSerializer):
    def validate_descendente(self, value):
        if isinstance(value, Pasta):
            return value
        if value == None or value == "":
            return None
        if not Pasta.objects.filter(id=value).exists():
            raise serializers.ValidationError("Pasta pai inválida")
        return value


    class Meta:
        model = Pasta
        fields = "__all__"

class SerializadorUsuario(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class SerializadorDisciplina(serializers.ModelSerializer):
    def validate(self, data):
        """
        Verifica dados recebidos
        """
        print("Disciplina/n",data)

    class Meta:
        model = Disciplina
        fields = '__all__'

class SerializadorTurma(serializers.ModelSerializer):
    disciplina = SerializadorDisciplina()
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['disciplina'] = SerializadorDisciplina(instance.disciplina).data
        return representation

    class Meta:
        model = Turma
        fields = "__all__"


class SerializadorParticipantesTurma(serializers.ModelSerializer):
    aluno_id = serializers.ReadOnlyField(source='aluno.id')
    nome = serializers.ReadOnlyField(source='aluno.nome')
    username = serializers.ReadOnlyField(source='aluno.username')
    class Meta:
        model = Participa
        fields = ['id', 'aluno_id', 'nome', 'username']


class SerializadorParticipa(serializers.ModelSerializer):
    class Meta:
        model = Participa
        fields = "__all__"