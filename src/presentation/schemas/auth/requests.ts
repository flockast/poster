import { Type } from '@sinclair/typebox'

export const SignUp = Type.Object({
  email: Type.String(),
  password: Type.String()
})

export const SignIn = Type.Object({
  email: Type.String(),
  password: Type.String()
})
