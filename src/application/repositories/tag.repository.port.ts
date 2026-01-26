import type { Tag, CreateTag, UpdateTag } from '../entities/tag.entity'

export interface TagRepositoryPort {
  findAll(): Promise<Tag[]>
  findById(id: Tag['id']): Promise<Tag | undefined>
  findBySlug(slug: Tag['slug']): Promise<Tag | undefined>
  create(payload: CreateTag): Promise<Tag>
  update(id: Tag['id'], payload: UpdateTag): Promise<Tag | undefined>
  delete(id: Tag['id']): Promise<Tag | undefined>
}
