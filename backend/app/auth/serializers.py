from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

from app.models import User


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['username'] = user.username

        return token
    
    # def validate(self, attrs):
        

class RegisterSerializer(serializers.ModelSerializer):
    PAPEL_CHOICES = (
        ('Aluno', 'Aluno'),
        ('Professor', 'Professor'),
    )
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    papel = serializers.ChoiceField(write_only=True, required=True, choices=PAPEL_CHOICES)
    class Meta:
        model = User
        fields = ('papel', 'username', 'email', 'password', 'password2', 'nome', 'matricula')
        # extra validations
        extra_kwargs = {
            'nome': {'required': True},
            'matricula': {'required': True, 'validators': [UniqueValidator(queryset=User.objects.all())]}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            nome=validated_data['nome'],
            matricula=validated_data['matricula'],
            papel=validated_data['papel'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user

