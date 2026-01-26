export const POST_STATUSES = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const

export type Post = {
  id: number
  slug: string
  title: string
  content: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export type CreatePost = {
  slug: string
  title: string
  content: string
  status: typeof POST_STATUSES[keyof typeof POST_STATUSES]
}

export type UpdatePost = Partial<CreatePost>
