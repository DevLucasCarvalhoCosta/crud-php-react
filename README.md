# Cadastro de Pessoas e Telefones

Aplicação web para cadastrar pessoas e seus telefones, onde cada pessoa pode ter vários telefones. O projeto é dividido em duas partes: uma API REST em PHP (pasta `backend/`) e uma interface em React (pasta `frontend/`). Os dados são armazenados em PostgreSQL.

**Aplicação online:** https://crud-php-react.vercel.app

## Tecnologias

- **Backend:** PHP 8.3, PDO, PostgreSQL
- **Frontend:** React 19, TypeScript, Vite, Ant Design
- **Validação:** Zod (frontend) e validação de CPF por dígitos verificadores (frontend e backend)
- **Integrações:** ViaCEP (endereço por CEP) e IBGE (cidades por estado)

## Estrutura do repositório

```
.
├── backend/                 API REST em PHP
│   ├── public/
│   │   └── index.php        ponto de entrada: roteamento, CORS e bootstrap
│   ├── src/
│   │   ├── Core/            conexão com o banco (PDO)
│   │   ├── Domain/          entidades Pessoa e Telefone
│   │   ├── Repository/      acesso ao banco de dados
│   │   ├── Service/         regras de negócio, validação e transações
│   │   └── Http/            controllers e roteador
│   ├── sql/schema.sql       criação das tabelas
│   ├── Dockerfile           imagem para deploy
│   └── .env.example         modelo das variáveis de ambiente
│
└── frontend/                interface em React + TypeScript
    └── src/
        ├── components/      formulário de cadastro e tabela de registros
        ├── api/             cliente HTTP que consome a API
        ├── schemas/         schemas de validação (Zod)
        ├── utils/           máscaras, ViaCEP, cidades do IBGE
        └── types.ts         tipos compartilhados
```

## Arquitetura

O **backend** segue uma separação em camadas para manter cada responsabilidade isolada:

- **Domínio** (`src/Domain`): as entidades `Pessoa` e `Telefone`.
- **Dados** (`src/Repository`): leitura e escrita no PostgreSQL com PDO e prepared statements.
- **Negócio** (`src/Service`): validações e a gravação de pessoa e telefones dentro de uma transação.
- **Apresentação** (`src/Http`): controllers e o roteador que expõem a API em JSON.

O **frontend** é uma SPA. O formulário usa o Ant Design, valida os campos com Zod e fala com a API por um cliente HTTP centralizado em `src/api`. A lista de registros é atualizada na tela assim que algo é gravado, sem recarregar a página.

## Funcionalidades

- Cadastro, edição e exclusão de pessoas (nome, CPF, RG e endereço).
- Vários telefones por pessoa, com descrição (WhatsApp, Celular, etc.).
- Campos obrigatórios validados com Zod, com mensagem por campo.
- Máscaras de CPF, CEP e telefone, e validação de CPF.
- CEP preenche o endereço automaticamente (logradouro, bairro, cidade e UF).
- Cidade em formato de busca, carregada conforme a UF selecionada.
- Tabela ordenável por nome, CPF, RG e CEP, atualizada sem recarregar a página.

## Como rodar localmente

### Pré-requisitos

- PHP 8.3 ou superior, com a extensão `pdo_pgsql`
- Composer
- Node.js 18 ou superior
- Um PostgreSQL acessível (local ou em nuvem)

### 1. Banco de dados

Crie um banco no PostgreSQL e rode o script que cria as tabelas:

```bash
psql "sua_connection_string" -f backend/sql/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env      # preencha os dados de conexão do banco
composer install
php -S localhost:8000 -t public
```

A API fica disponível em `http://localhost:8000/api/pessoas`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:8000
npm install
npm run dev
```

A interface abre em `http://localhost:5173`.

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/pessoas` | Lista todas as pessoas com seus telefones |
| GET | `/api/pessoas/{id}` | Retorna uma pessoa |
| POST | `/api/pessoas` | Cria uma pessoa |
| PUT | `/api/pessoas/{id}` | Atualiza uma pessoa |
| DELETE | `/api/pessoas/{id}` | Remove uma pessoa |

O corpo de criação e atualização segue o formato:

```json
{
  "nome": "João da Silva",
  "cpf": "529.982.247-25",
  "rg": "1234567",
  "cep": "74000-000",
  "logradouro": "Rua A",
  "complemento": "",
  "setor": "Centro",
  "cidade": "Goiânia",
  "uf": "GO",
  "telefones": [
    { "telefone": "(62) 99988-7755", "descricao": "WhatsApp" }
  ]
}
```

## Deploy

- **Backend:** Railway, usando o `backend/Dockerfile`. O container escuta na porta indicada pela variável `PORT`. Variáveis necessárias: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_SSLMODE` e `CORS_ORIGIN` (origem do frontend).
- **Frontend:** Vercel, com o diretório raiz apontando para `frontend/` e a variável `VITE_API_URL` apontando para a URL da API.
- **Banco:** PostgreSQL gerenciado (por exemplo, Neon).
