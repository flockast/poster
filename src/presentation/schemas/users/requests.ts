import { Type } from '@sinclair/typebox'

export const UserId = Type.Object({
  userId: Type.Number()
})

export const UserEmail = Type.Object({
  email: Type.String()
})

export const CreateUser = Type.Object({
  email: Type.String(),
  password: Type.String()
})

export const UpdateUser = Type.Partial(CreateUser)
