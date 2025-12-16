export type User = {
  id: number
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUser = Partial<CreateUser>
