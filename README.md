# GraphoGram

Repositorio para o projeto final do curso de Ciência da Computação PUC-Rio.

Esse projeto consiste em uma ferramenta de diagramação, que permite que professores criem diagramas e gerenciem o acesso ao material por turmas.

## Funcionamento

O frontend do sistema foi implementado em JavaScript e utiliza React, interagindo com o backend desenvolvido em python utilizando Django Rest Framework.

O sistema estará disponível na porta 3000. O Backend na porta 8000/api.

## Execução

Para popular o banco com as diciplinas é necessário utilizar:
    
    `py manage.py import_disciplinas <caminho do arquivo csv>`
    
Para criar os grupos e permissões de usuários:
    
    `py manage.py set_groups`
 
# Licença MIT
