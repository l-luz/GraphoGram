# app/management/commands/import_disciplinas.py

from django.core.management.base import BaseCommand
import pandas as pd
from app.models import Disciplina

class Command(BaseCommand):
    help = 'Importa disciplinas do arquivo CSV'

    def add_arguments(self, parser):
        parser.add_argument('caminho_arquivo', type=str, help='Caminho do arquivo CSV')

    def handle(self, *args, **options):
        caminho_arquivo = options['caminho_arquivo']
        disciplinas = pd.read_csv(caminho_arquivo, header=3, delimiter=';', encoding='UTF-16LE', usecols=range(11))
        disciplinas = disciplinas.loc[:, ['Disciplina', 'Nome da disciplina', 'Depto']] 
        nonAdded = []
        for _, linha in disciplinas.iterrows():
            try:
                Disciplina.objects.create(
                    codigo=linha["Disciplina"],
                    nome=linha["Nome da disciplina"],
                    depto=linha["Depto"]
                )
            except:
                nonAdded.append({
                    "codigo": linha["Disciplina"],
                    "nome": linha["Nome da disciplina"],
                    "depto": linha["Depto"]
                })
                pass
        if nonAdded:
            self.stdout.write(self.style.NOTICE(f'Foram adicionadas {len(nonAdded)} de {len(disciplinas)}.\nDisciplinas não adicionadas (Naturalmente, duplicatas não serão adicionadas):\n'))
            self.stdout.write(self.style.NOTICE(nonAdded))

        else:
            self.stdout.write(self.style.SUCCESS(f'{len(nonAdded)} disciplinas importadas com sucesso.'))
