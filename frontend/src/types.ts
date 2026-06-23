export interface Telefone {
  id?: number
  telefone: string
  descricao: string
}

export interface Pessoa {
  id: number
  nome: string
  cpf: string
  rg: string | null
  cep: string | null
  logradouro: string | null
  complemento: string | null
  setor: string | null
  cidade: string | null
  uf: string | null
  telefones: Telefone[]
}

export interface PessoaFormValues {
  id?: number | null
  nome: string
  cpf: string
  rg?: string
  cep?: string
  logradouro?: string
  complemento?: string
  setor?: string
  cidade?: string
  uf?: string
  telefones: Telefone[]
}

export interface Endereco {
  logradouro: string
  setor: string
  cidade: string
  uf: string
}
