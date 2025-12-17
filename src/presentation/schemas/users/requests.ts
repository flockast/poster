import { Type } from '@sinclair/typebox'

export const UserId = Type.Object({
  userId: Type.Number()
})

export const UserEmail = Type.Object({
  email: Type.String({ format: 'email' })
})

export const UpdateUser = Type.Partial(Type.Object({
  email: Type.String(),
  password: Type.String({
    minLength: 8,
    maxLength: 100
  })
}))
