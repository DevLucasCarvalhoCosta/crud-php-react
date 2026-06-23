interface MunicipioIBGE {
  nome: string
}

export async function buscarCidades(uf: string): Promise<string[]> {
  if (!uf) return []
  try {
    const resp = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`,
    )
    const data = await resp.json()
    if (!Array.isArray(data)) return []
    return (data as MunicipioIBGE[]).map((c) => c.nome)
  } catch {
    return []
  }
}
