import type { Rule } from 'antd/es/form'
import type { ZodType } from 'zod'

export const zodRule = (schema: ZodType): Rule => ({
  validator(_rule, value) {
    const v = value === undefined || value === null ? '' : value
    const r = schema.safeParse(v)
    if (r.success) return Promise.resolve()
    return Promise.reject(new Error(r.error.issues[0]?.message ?? 'Valor inválido'))
  },
})
