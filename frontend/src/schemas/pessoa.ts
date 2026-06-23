import { z } from 'zod'
import { somenteDigitos } from '../utils/mascaras'
import { cpfValido } from '../utils/validacao'
import type { Telefone } from '../types'

export const nomeSchema = z.string().trim().min(1, 'Informe o nome')

export const cpfSchema = z
  .string()
  .min(1, 'Informe o CPF')
  .refine(cpfValido, 'CPF inválido')

export const rgSchema = z.string().trim().min(1, 'Informe o RG')

export const cepSchema = z
  .string()
  .min(1, 'Informe o CEP')
  .refine((v) => somenteDigitos(v).length === 8, 'CEP incompleto')

export const telefonesSchema = z
  .array(z.object({ telefone: z.string(), descricao: z.string() }))
  .refine(
    (arr) => (arr || []).some((t: Telefone) => (t.telefone || '').trim() !== ''),
    'Informe ao menos um telefone',
  )
