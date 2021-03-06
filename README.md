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
- Ao realizar um aluguel, o status do carro deverá ser alterado para indisponível.

## Devolução de carro

**Requisitos Funcionais**

- Deve ser possível realizar a devolução de um carro

**Regras de Negócio**

- Se o carro for devolvido com menos de 24 horas, deverá ser cobrado a diária completa.
- Ao realizar a devolução, o carro deverá ser liberado para outro aluguel.
- Ao realizar a devolução, o usuário deverá ser liberado para outro aluguel.
- Ao realizar a devolução, deverá ser calculado o total do aluguel.
- Caso o horário de devolução seja superior ao horário previsto de entrega, deverá ser cobrado multa proporcional aos dias de atraso.
- Caso haja multa, deverá ser somado ao total do aluguel.
- O usuário deve estar logado na aplicação.

## Listagem de alugueis para usuário

**Requisitos Funcionais**

- Deve ser possível realizar a busca de todos os alugueis para o usuário

**Regras de Negócio**

- O usuário deve estar logado na aplicação

## Recuperar senha

**Requisitos Funcionais**

- Deve ser possível o usuário recuperar a senha informando o email
- O usuário deve receber um email com o passo a passo para a recuperação da senha
- O usuário deve conseguir inserir uma nova senha

**Regras de Negócio**

- O usuário precisa informar uma nova senha
- O link enviado para a recuperação deve expirar em 3 horas
