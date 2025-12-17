import { Type } from '@sinclair/typebox'

export const SignUp = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({
    minLength: 8,
    maxLength: 100
  })
})

export const SignIn = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String()
})
