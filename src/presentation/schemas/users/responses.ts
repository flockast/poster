import { Type } from '@sinclair/typebox'

export const User = Type.Object({
  id: Type.Number(),
  email: Type.String()
})

export const Users = Type.Array(User)
