export type Tag = {
  id: number
  slug: string
  title: string
  createdAt: Date
  updatedAt: Date
}

export type CreateTag = {
  slug: string
  title: string
}

export type UpdateTag = Partial<CreateTag>
