import { useEffect, useState } from 'react'
import { Form, Input, Select, Button, Row, Col, Popconfirm, Space, Spin } from 'antd'
import type { Pessoa, PessoaFormValues, Telefone } from '../types'
import { mascaraCpf, mascaraCep, mascaraTelefone, somenteDigitos } from '../utils/mascaras'
import { buscarCep } from '../utils/viacep'
import { buscarCidades } from '../utils/ibge'
import { zodRule } from '../utils/zodRule'
import { nomeSchema, cpfSchema, rgSchema, cepSchema, telefonesSchema } from '../schemas/pessoa'

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT',
  'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO']

const telefonesIniciais = (): Telefone[] =>
  Array.from({ length: 5 }, () => ({ telefone: '', descricao: '' }))

interface Props {
  pessoaEdicao: Pessoa | null
  onGravar: (valores: PessoaFormValues) => Promise<void>
  onExcluir: (id: number) => Promise<void>
  onCancelar: () => void
}

export default function FormularioPessoa({ pessoaEdicao, onGravar, onExcluir, onCancelar }: Props) {
  const [form] = Form.useForm<PessoaFormValues>()
  const [idEdicao, setIdEdicao] = useState<number | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [cidades, setCidades] = useState<string[]>([])
  const [carregandoCidades, setCarregandoCidades] = useState(false)

  const ufSelecionada = Form.useWatch('uf', form)

  useEffect(() => {
    let ativo = true
    if (!ufSelecionada) {
      setCidades([])
      return
    }
    setCarregandoCidades(true)
    buscarCidades(ufSelecionada).then((lista) => {
      if (ativo) {
        setCidades(lista)
        setCarregandoCidades(false)
      }
    })
    return () => { ativo = false }
  }, [ufSelecionada])

  useEffect(() => {
    if (pessoaEdicao) {
      const tels = (pessoaEdicao.telefones || []).map((t) => ({
        telefone: t.telefone, descricao: t.descricao || '',
      }))
      form.setFieldsValue({
        nome: pessoaEdicao.nome,
        cpf: mascaraCpf(pessoaEdicao.cpf),
        rg: pessoaEdicao.rg || '',
        cep: pessoaEdicao.cep ? mascaraCep(pessoaEdicao.cep) : '',
        logradouro: pessoaEdicao.logradouro || '',
        complemento: pessoaEdicao.complemento || '',
        setor: pessoaEdicao.setor || '',
        uf: pessoaEdicao.uf || undefined,
        cidade: pessoaEdicao.cidade || undefined,
        telefones: tels.length ? tels : telefonesIniciais(),
      })
      setIdEdicao(pessoaEdicao.id)
    }
  }, [pessoaEdicao, form])

  const limpar = () => {
    form.resetFields()
    form.setFieldsValue({ telefones: telefonesIniciais() })
    setIdEdicao(null)
  }

  const onCepBlur = async () => {
    const cep = form.getFieldValue('cep') as string
    if (somenteDigitos(cep || '').length !== 8) return
    setBuscandoCep(true)
    const ende = await buscarCep(cep)
    setBuscandoCep(false)
    if (ende) {
      form.setFieldsValue({
        logradouro: ende.logradouro,
        setor: ende.setor,
        uf: ende.uf || undefined,
        cidade: ende.cidade || undefined,
      })
    }
  }

  const onFinish = async (valores: PessoaFormValues) => {
    const payload: PessoaFormValues = {
      ...valores,
      id: idEdicao,
      telefones: (valores.telefones || []).filter((t) => (t.telefone || '').trim() !== ''),
    }
    setSalvando(true)
    try {
      await onGravar(payload)
      limpar()
    } catch {
      return
    } finally {
      setSalvando(false)
    }
  }

  const excluir = async () => {
    if (idEdicao === null) return
    await onExcluir(idEdicao)
    limpar()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ telefones: telefonesIniciais() }}
      autoComplete="off"
    >
      <Row gutter={24}>
        <Col xs={24} md={13}>
          <Form.Item label="Nome" name="nome" rules={[zodRule(nomeSchema)]}>
            <Input placeholder="Nome completo" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="CPF" name="cpf" normalize={mascaraCpf} rules={[zodRule(cpfSchema)]}>
                <Input placeholder="000.000.000-00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="RG" name="rg" rules={[zodRule(rgSchema)]}>
                <Input placeholder="RG" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="CEP"
                name="cep"
                normalize={mascaraCep}
                rules={[zodRule(cepSchema)]}
                tooltip="Digite o CEP e o endereço é preenchido automaticamente"
              >
                <Input
                  placeholder="00000-000"
                  onBlur={onCepBlur}
                  suffix={buscandoCep ? <Spin size="small" /> : <span style={{ width: 14 }} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="UF" name="uf">
                <Select
                  placeholder="Selecione"
                  allowClear
                  showSearch
                  onChange={() => form.setFieldsValue({ cidade: undefined })}
                  options={UFS.map((uf) => ({ value: uf, label: uf }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Logradouro" name="logradouro">
            <Input placeholder="Rua, número" />
          </Form.Item>
          <Form.Item label="Complemento" name="complemento">
            <Input placeholder="Apto, bloco..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Setor / Bairro" name="setor">
                <Input placeholder="Setor" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Cidade" name="cidade">
                <Select
                  showSearch
                  allowClear
                  loading={carregandoCidades}
                  placeholder={ufSelecionada ? 'Selecione a cidade' : 'Selecione a UF primeiro'}
                  options={cidades.map((c) => ({ value: c, label: c }))}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  notFoundContent={carregandoCidades ? 'Carregando...' : 'Selecione uma UF'}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>

        <Col xs={24} md={11}>
          <div className="bloco-telefones">
            <label className="rotulo-telefones">Telefones</label>
            <Form.List
              name="telefones"
              rules={[{
                validator: async (_rule, tels) => {
                  const r = telefonesSchema.safeParse(tels)
                  if (!r.success) {
                    return Promise.reject(new Error(r.error.issues[0]?.message ?? 'Informe ao menos um telefone'))
                  }
                },
              }]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  <table className="tabela-telefones">
                    <thead>
                      <tr><th>Telefone</th><th>Descrição</th><th /></tr>
                    </thead>
                    <tbody>
                      {fields.map((field) => (
                        <tr key={field.key}>
                          <td>
                            <Form.Item name={[field.name, 'telefone']} normalize={mascaraTelefone} noStyle>
                              <Input placeholder="(62) 99999-9999" />
                            </Form.Item>
                          </td>
                          <td>
                            <Form.Item name={[field.name, 'descricao']} noStyle>
                              <Input placeholder="WhatsApp, Cel..." />
                            </Form.Item>
                          </td>
                          <td>
                            <Button type="text" danger onClick={() => remove(field.name)}>×</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Button type="dashed" block onClick={() => add({ telefone: '', descricao: '' })}
                    style={{ marginTop: 8 }}>
                    + Adicionar telefone
                  </Button>
                  <Form.ErrorList errors={errors} />
                </>
              )}
            </Form.List>
          </div>
        </Col>
      </Row>

      <Space style={{ marginTop: 16 }}>
        <Button type="primary" htmlType="submit" loading={salvando}>Gravar</Button>
        {idEdicao !== null && (
          <Popconfirm title="Excluir esta pessoa?" okText="Excluir" cancelText="Cancelar" onConfirm={excluir}>
            <Button danger>Excluir</Button>
          </Popconfirm>
        )}
        {idEdicao !== null && (
          <Button onClick={() => { onCancelar(); limpar() }}>Cancelar</Button>
        )}
      </Space>
    </Form>
  )
}
