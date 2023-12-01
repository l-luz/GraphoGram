import pandas as pd
from app.models import Disciplina

disciplinas = pd.read_csv("backend\\app\HORARIO_DAS_DISCIPLINAS_13112023.csv", header=3, delimiter=';', encoding='UTF-16LE', usecols=range(11))
disciplinas = disciplinas.loc[:, ['Disciplina', 'Nome da disciplina', 'Depto']] 

for _, linha in disciplinas.iterrows():
    Disciplina.objects.create(
        codigo = linha["Disciplina"],
        nome = linha["Nome da disciplina"],
        depto = linha["Depto"]
    )
    
