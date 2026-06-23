import { somenteDigitos } from './mascaras'

export function cpfValido(cpf: string): boolean {
  const d = somenteDigitos(cpf)
  if (d.length !== 11) return false
  if (/^(\d)\1{10}$/.test(d)) return false

  for (let t = 9; t < 11; t++) {
    let soma = 0
    for (let i = 0; i < t; i++) soma += Number(d[i]) * (t + 1 - i)
    let dv = (10 * soma) % 11
    if (dv === 10) dv = 0
    if (dv !== Number(d[t])) return false
  }
  return true
}
