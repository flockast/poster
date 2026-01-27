import { Type } from '@sinclair/typebox'

export const Response = Type.Object({
  status: Type.String(),
  currentDateTime: Type.String({ format: 'date-time' })
})
