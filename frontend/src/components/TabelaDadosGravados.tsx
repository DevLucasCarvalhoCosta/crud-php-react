import { Table, Button, Popconfirm, Space } from 'antd'
import type { TableColumnsType } from 'antd'
import type { Pessoa } from '../types'
import { mascaraCpf, mascaraCep, mascaraTelefone } from '../utils/mascaras'

interface Props {
  pessoas: Pessoa[]
  onEditar: (id: number) => void
  onExcluir: (id: number) => Promise<void>
}

export default function TabelaDadosGravados({ pessoas, onEditar, onExcluir }: Props) {
  const lista = Array.isArray(pessoas) ? pessoas : []

  const colunas: TableColumnsType<Pessoa> = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      sorter: (a, b) => (a.nome || '').localeCompare(b.nome || '', 'pt-BR'),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      render: (cpf: string) => mascaraCpf(cpf),
      sorter: (a, b) => (a.cpf || '').localeCompare(b.cpf || ''),
    },
    {
      title: 'RG',
      dataIndex: 'rg',
      sorter: (a, b) => (a.rg || '').localeCompare(b.rg || ''),
    },
    {
      title: 'CEP',
      dataIndex: 'cep',
      render: (cep: string | null) => (cep ? mascaraCep(cep) : ''),
      sorter: (a, b) => (a.cep || '').localeCompare(b.cep || ''),
    },
    {
      title: 'Telefone - Descrição',
      key: 'telefones',
      render: (_, p) => (
        <Space direction="vertical" size={0}>
          {(p.telefones || []).map((t) => (
            <span key={t.id ?? t.telefone}>
              {mascaraTelefone(t.telefone)}{t.descricao ? ` - ${t.descricao}` : ''}
            </span>
          ))}
        </Space>
      ),
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 160,
      render: (_, p) => (
        <Space>
          <Button size="small" onClick={() => onEditar(p.id)}>Editar</Button>
          <Popconfirm title="Excluir esta pessoa?" okText="Excluir" cancelText="Cancelar"
            onConfirm={() => onExcluir(p.id)}>
            <Button size="small" danger>Excluir</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table<Pessoa>
      rowKey="id"
      columns={colunas}
      dataSource={lista}
      pagination={{ pageSize: 8, hideOnSinglePage: true }}
      locale={{ emptyText: 'Nenhum registro gravado.' }}
      size="middle"
    />
  )
}
