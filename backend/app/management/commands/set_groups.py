from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

class Command(BaseCommand):
    help = 'Cria grupos e atribui permissões a eles'

    def handle(self, *args, **options):
        grupo_e_permissoes = {
            "aluno": ["view_user", "view_pasta", "view_diagrama"],
            "professor": [
                "add_user", "change_user", "delete_user", "view_user",
                "add_diagrama", "change_diagrama", "delete_diagrama", "view_diagrama",
                "view_disciplina",
                "add_turma", "change_turma", "delete_turma", "view_turma",
                "add_pasta", "change_pasta", "delete_pasta", "view_pasta",
                "add_participa", "change_participa", "delete_participa", "view_participa",
                "add_gerencia", "change_gerencia", "delete_gerencia", "view_gerencia",
                "add_acessopasta", "change_acessopasta", "delete_acessopasta", "view_acessopasta",
                "add_acessodiagrama", "change_acessodiagrama", "delete_acessodiagrama", "view_acessodiagrama"
            ],
        }

        for group_name, permissions in grupo_e_permissoes.items():
            group, created = Group.objects.get_or_create(name=group_name)
            
            for permission_codename in permissions:
                permission = Permission.objects.get(codename=permission_codename)
                group.permissions.add(permission)
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"Grupo '{group_name}' criado com sucesso e permissões atribuídas."))
            else:
                self.stdout.write(self.style.SUCCESS(f"Grupo '{group_name}' já existe."))
