CREATE TABLE IF NOT EXISTS pessoa (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    cpf         VARCHAR(11)  NOT NULL UNIQUE,
    rg          VARCHAR(20),
    cep         VARCHAR(8),
    logradouro  VARCHAR(200),
    complemento VARCHAR(100),
    setor       VARCHAR(100),
    cidade      VARCHAR(100),
    uf          CHAR(2),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS telefone (
    id        SERIAL PRIMARY KEY,
    pessoa_id INTEGER NOT NULL REFERENCES pessoa(id) ON DELETE CASCADE,
    telefone  VARCHAR(11) NOT NULL,
    descricao VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_telefone_pessoa ON telefone(pessoa_id);
