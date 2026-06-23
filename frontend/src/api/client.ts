import type { Pessoa, PessoaFormValues } from '../types'

const RAW = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const BASE = (/^https?:\/\//i.test(RAW) ? RAW : `https://${RAW}`).replace(/\/$/, '')

async function req<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T | null> {
  const resp = await fetch(`${BASE}${caminho}`, {
    method: metodo,
    headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
    body: corpo ? JSON.stringify(corpo) : undefined,
  })
  if (resp.status === 204) return null
  const data = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    const msg = (data as { erro?: string }).erro || 'Erro na requisição'
    throw new Error(msg)
  }
  return data as T
}

export const api = {
  async listar(): Promise<Pessoa[]> {
    const data = await req<Pessoa[]>('GET', '/api/pessoas')
    return Array.isArray(data) ? data : []
  },
  buscar: (id: number) => req<Pessoa>('GET', `/api/pessoas/${id}`),
  criar: (pessoa: PessoaFormValues) => req<Pessoa>('POST', '/api/pessoas', pessoa),
  atualizar: (id: number, pessoa: PessoaFormValues) =>
    req<Pessoa>('PUT', `/api/pessoas/${id}`, pessoa),
  excluir: (id: number) => req<void>('DELETE', `/api/pessoas/${id}`),
}
