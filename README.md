# Sistema de Gerenciamento de CME (Central de Materiais e Esterilização)

## 📑 Índice

1. [Descrição](#-descrição)
2. [Funcionalidades](#-funcionalidades)
   - [Cadastro de Usuários](#1-cadastro-de-usuários)
   - [Cadastro de Materiais](#2-cadastro-de-materiais)
   - [Rastreabilidade](#3-rastreabilidade)
   - [Etapas do Processo](#4-etapas-do-processo)
3. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4. [Estrutura do Projeto](#-estrutura-do-projeto)
5. [Pré-requisitos](#-pré-requisitos)
6. [Como Executar o Projeto](#-como-executar-o-projeto)
7. [Usuários](#-usuários)
8. [Banco de Dados](#-banco-de-dados)
9. [Documentação da API](#-documentação-da-api)
10. [Documentação de Código](#-documentação-de-código)
11. [Relatórios](#-relatórios)
12. [Autor](#-autor)

## 📜 Descrição

Este projeto foi desenvolvido como parte de um desafio técnico proposto pelo **Grupo Bringel**.  
O objetivo é criar uma aplicação web que auxilie no controle e rastreabilidade dos processos realizados em uma CME, permitindo a gestão de materiais, usuários e a geração de relatórios detalhados.

## 🚀 Funcionalidades

### 1. **Cadastro de Usuários**

- **Usuário Técnico**: Realiza as etapas do processo.
- **Usuário Enfermagem**: Consulta a rastreabilidade, falhas e relatórios.
- **Usuário Administrativo**: Gerencia usuários e cadastra materiais.

### 2. **Cadastro de Materiais**

- Informações do material:
  - Nome
  - Tipo
  - Data de validade
  - Serial (gerado automaticamente).

### 3. **Rastreabilidade**

- Visualização das etapas que um material passou.
- Exibição das falhas associadas ao serial e a quantidade de vezes que o material passou pelo processo.
- Geração de relatórios em PDF e XLSX:
  - Materiais que passaram por todas as etapas.
  - Falhas registradas.

### 4. **Etapas do Processo**

1. **Recebimento**: Registro do material recebido dos setores do hospital.
2. **Lavagem**: Lavagem dos materiais.
3. **Esterilização**: Esterilização com alta temperatura.
4. **Distribuição**: Distribuição dos materiais para os setores do hospital.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React.js, Axios
- **Backend**: Python (Django Rest Framework - DRF)
- **Banco de Dados**: PostgreSQL
- **Contêineres**: Docker

## 🏗️ Estrutura do Projeto

```bash
├── backend/           # Código do backend em Django
├── frontend/          # Código do frontend em React
├── docker-compose.yml # Arquivo de configuração do Docker Compose
├── README.md          # Documentação do projeto
```

## 🧩 Pré-requisitos

Certifique-se de ter os seguintes softwares instalados:

- Docker
- Docker Compose

## 📦 Como Executar o Projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/HernanJr0/Projeto-CME
   cd Projeto-CME
   ```

2. Configure o ambiente:

   ```bash
   python -m venv env
   ```

   - Windows:
     ```bash
     env\Scripts\activate
     ```
   - Linux ou MacOS:
     ```bash
     source env/bin/activate
     ```

3. Construa e inicie os contêineres:

   ```bash
   docker-compose up --build
   ```

4. Acesse a aplicação:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend (API): [http://localhost:8005](http://localhost:8005)

## 👥 Usuários

O sistema já inclui um usuário administrativo criado automaticamente ao rodar a migration `0002_createAdm.py`, com o usuário **admin** a senha **admin**.

## 🗃️ Banco de Dados

O sistema utiliza PostgreSQL como banco de dados. Após subir os contêineres, as tabelas serão criadas automaticamente utilizando as migrations do Django.

## 📄 Documentação da API

A documentação interativa da API está disponível em:

- Swagger: [http://localhost:8005/swagger](http://localhost:8005/swagger)
- ReDoc: [https://localhost:8005/redoc](https://localhost:8005/redoc)

## 📑 Documentação de Código

- **Backend**: Organizado por módulos Django (users, materials, processes).
- **Frontend**: Componentes React organizados em pastas, utilizando Material-UI para a interface.

## 📝 Relatórios

Relatórios em PDF e XLSX podem ser gerados pela interface da aplicação. Eles contêm dados detalhados dos processos e falhas.

## 👨‍💻 Autor

Desenvolvido por Luis Hernan Junior

- Contatos:
  - Celular: (92) 994195089
  - Email: hernanjunior90@gmail.com
