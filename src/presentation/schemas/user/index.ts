import { Type } from '@sinclair/typebox'
import { USER_ROLES } from '@/domain/entities/user.entity'

export const UserId = Type.Object({
  id: Type.Number()
})

export const UserEmail = Type.Object({
  email: Type.String({ format: 'email' })
})

export const UserPassword = Type.Object({
  password: Type.String({
    minLength: 8,
    maxLength: 100
  })
})

export const UserRole = Type.Object({
  role: Type.Union([
    Type.Literal(USER_ROLES.USER),
    Type.Literal(USER_ROLES.ADMIN),
    Type.Literal(USER_ROLES.MODERATOR)
  ])
})

export const User = Type.Composite([
  UserId,
  UserEmail,
  UserRole
])

export const UsersList = Type.Array(User)

export const LoginRequest = Type.Composite([
  UserEmail,
  UserPassword
])

export const LoginResponse = Type.Object({
  user: User,
  token: Type.String()
})

export const RegistrationRequest = Type.Composite([
  UserEmail,
  UserPassword
])

export const RegistrationResponse = Type.Object({
  user: User,
  token: Type.String()
})

export const CreateRequest = Type.Composite([
  Type.Omit(User, ['id']),
  UserPassword,
  UserRole
])

export const UpdateRequest = Type.Partial(CreateRequest)

export const UpdateMeRequest = Type.Partial(
  Type.Omit(CreateRequest, ['role'])
)
