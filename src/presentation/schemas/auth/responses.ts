import { Type } from '@sinclair/typebox'

export const User = Type.Object({
  user: Type.Object({
    id: Type.Number(),
    email: Type.String(),
  }),
  token: Type.String()
})

export const Me = Type.Object({
  id: Type.Number(),
  email: Type.String()
})
