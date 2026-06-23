import { useEffect, useState } from 'react'
import { ConfigProvider, App as AntApp, Card, Typography } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import FormularioPessoa from './components/FormularioPessoa'
import TabelaDadosGravados from './components/TabelaDadosGravados'
import { api } from './api/client'
import type { Pessoa, PessoaFormValues } from './types'
import './App.css'

function Conteudo() {
  const { message } = AntApp.useApp()
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [edicao, setEdicao] = useState<Pessoa | null>(null)

  const carregar = async () => {
    try {
      setPessoas(await api.listar())
    } catch (e) {
      message.error('Falha ao carregar dados: ' + (e as Error).message)
      setPessoas([])
    }
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const gravar = async (valores: PessoaFormValues) => {
    try {
      if (valores.id) {
        await api.atualizar(valores.id, valores)
      } else {
        await api.criar(valores)
      }
      message.success('Registro salvo com sucesso')
      await carregar()
      setEdicao(null)
    } catch (e) {
      message.error((e as Error).message)
      throw e
    }
  }

  const editar = async (id: number) => {
    const p = await api.buscar(id)
    if (p) {
      setEdicao(p)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const excluir = async (id: number) => {
    try {
      await api.excluir(id)
      message.success('Registro excluído')
      await carregar()
      setEdicao(null)
    } catch (e) {
      message.error((e as Error).message)
    }
  }

  return (
    <div className="container">
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        Cadastro de pessoa
      </Typography.Title>
      <Card style={{ marginBottom: 24 }}>
        <FormularioPessoa
          pessoaEdicao={edicao}
          onGravar={gravar}
          onExcluir={excluir}
          onCancelar={() => setEdicao(null)}
        />
      </Card>

      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        Dados gravados
      </Typography.Title>
      <Card>
        <TabelaDadosGravados pessoas={pessoas} onEditar={editar} onExcluir={excluir} />
      </Card>
    </div>
  )
}

export default function App() {
  return (
    <ConfigProvider locale={ptBR} theme={{ token: { colorPrimary: '#2563eb' } }}>
      <AntApp>
        <Conteudo />
      </AntApp>
    </ConfigProvider>
  )
}
