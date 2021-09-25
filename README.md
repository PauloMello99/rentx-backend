# RentX Backend

Este projeto foi desenvolvido durante a trilha de Node.js na plataforma de estudos RocketSeat. A finalidade do projeto é criar um sistema de aluguel de carros, chamado RentX, se baseando nos princípios do SOLID e API REST, com utilização do TypeScript.

Foi abordado neste projeto:

- Injeção de dependências (TSyringe)
- Manipulação de containers (Docker)
- ORM (TypeORM)
- Documentação de API (Swagger)
- Upload de arquivos e leitura de CSV (csv-parse)
- Fluxo de autenticação (JWT)
- Uso do Express

# Requisitos do sistema

## Cadastro de Carro

**Requisitos Funcionais**

- Deve ser possível cadastrar um novo carro.

**Regras de Negócio**

- Não deve ser possível cadastrar um carro com uma placa já existente.
- O carro deve ser cadastrado, por padrão, como disponível.
- O usuário responsável pelo cadastro deve ser um usuário administrador.

## Listagem de Carros

**Requisitos Funcionais**

- Deve ser possível listar todos os carros disponíveis.
- Deve ser possível listar todos os carros disponíveis por categoria.
- Deve ser possível listar todos os carros disponíveis por nome.
- Deve ser possível listar todos os carros disponíveis por marca.

**Regras de Negócio**

- O usuário não precisa estar logado no sistema.

## Cadastro de Especificação do carro

**Requisitos Funcionais**

- Deve ser possível cadastrar uma especificação para um carro.

**Regras de Negócio**

- Não deve ser possível cadastrar uma especificação para um carro não cadastrado.
- Não deve ser cadastrada uma mesma especificação já existente para um carro.
- O usuário responsável pelo cadastro deve ser um usuário administrador.

## Cadastro de imagem do carro

**Requisitos Funcionais**

- Deve ser possível cadastrar a imagem do carro.

**Requisitos Não Funcionais**

- Utilizar o Multer para upload dos arquivos.

**Regras de Negócio**

- O usuário deve poder cadastrar mais de uma imagem para o mesmo carro.
- O usuário responsável pelo cadastro deve ser um usuário administrador.

## Aluguel de carro

**Requisitos Funcionais**

- Deve ser possível cadastrar um aluguel

**Regras de Negócio**

- O aluguel deve ter duração mínima de 24 horas.
- Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário.
- Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo carro.
