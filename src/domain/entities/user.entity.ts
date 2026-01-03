export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
} as const

export type User = {
  id: number
  email: string
  passwordHash: string
  role: typeof USER_ROLES[keyof typeof USER_ROLES]
  createdAt: Date
  updatedAt: Date
}

export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUser = Partial<CreateUser>
