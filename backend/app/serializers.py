from rest_framework import serializers
from app.models import *
class SerializadorDiagrama(serializers.ModelSerializer):
    class Meta:
        model = Diagrama
        fields = "__all__"

class SerializadorPasta(serializers.ModelSerializer):
    class Meta:
        model = Pasta
        fields = "__all__"

class SerializadorUsuario(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class SerializadorDisciplina(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = '__all__'

class SerializadorTurma(serializers.ModelSerializer):
    class Meta:
        model = Turma
        fields = '__all__'
