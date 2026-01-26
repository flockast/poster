import type { PaginationRequest, PaginationResponse, SortByRequest } from '../common/type'
import type { CreatePost, Post, UpdatePost } from '../entities/post.entity'
import type { User } from '../entities/user.entity'
import type { Category } from '../entities/category.entity'
import type { Tag } from '../entities/tag.entity'

export type PostWithRelations = Post & {
  user: User
  category: Category | null
  tags: Tag[]
}

export type CreatePostPayload = {
  post: CreatePost
  userId: User['id']
  categoryId?: Category['id']
  tagsIds?: Tag['id'][]
}

export type UpdatePostPayload = {
  post: UpdatePost
  categoryId?: Category['id']
  tagsIds?: Tag['id'][]
}

export interface PostRepositoryPort {
  findAll(pagination: PaginationRequest, sortBy: SortByRequest<Post>): Promise<PaginationResponse<PostWithRelations>>
  findById(id: Post['id']): Promise<PostWithRelations | undefined>
  findBySlug(slug: Post['slug']): Promise<PostWithRelations | undefined>
  create(payload: CreatePostPayload): Promise<PostWithRelations>
  update(id: Post['id'], payload: UpdatePostPayload): Promise<PostWithRelations | undefined>
  delete(id: Post['id']): Promise<PostWithRelations | undefined>
}
