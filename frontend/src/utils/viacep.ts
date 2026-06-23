import { somenteDigitos } from './mascaras'
import type { Endereco } from '../types'

export async function buscarCep(cep: string): Promise<Endereco | null> {
  const d = somenteDigitos(cep)
  if (d.length !== 8) return null
  try {
    const resp = await fetch(`https://viacep.com.br/ws/${d}/json/`)
    const data = await resp.json()
    if (data.erro) return null
    return {
      logradouro: data.logradouro || '',
      setor: data.bairro || '',
      cidade: data.localidade || '',
      uf: data.uf || '',
    }
  } catch {
    return null
  }
}
