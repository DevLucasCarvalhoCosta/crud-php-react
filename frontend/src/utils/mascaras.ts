export const somenteDigitos = (v: string | null | undefined): string =>
  (v || '').replace(/\D+/g, '')

export const mascaraCpf = (v: string): string =>
  somenteDigitos(v)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')

export const mascaraCep = (v: string): string =>
  somenteDigitos(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')

export const mascaraTelefone = (v: string): string => {
  const d = somenteDigitos(v).slice(0, 11)
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
  }
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}
