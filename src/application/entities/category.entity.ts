export type Category = {
  id: number
  slug: string
  title: string
  description: string | null,
  createdAt: Date
  updatedAt: Date
}

export type CreateCategory = {
  slug: string
  title: string
  description?: string
}

export type UpdateCategory = Partial<CreateCategory>
