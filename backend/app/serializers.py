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
        print(value)
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
    # def validate(self, data):
    #     """
    #     Verifica dados recebidos
    #     """
    #     print("Usuario/n",data)

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
    def validate(self, data):
        """
        Verifica dados recebidos
        """
        print("Turma/n",data)
    class Meta:
        model = Turma
        fields = '__all__'
    
class SerializadorParticipa(serializers.ModelSerializer):
    turma = SerializadorTurma(many=True)
    class Meta:
        model = Participa
        fields = "__all__"
