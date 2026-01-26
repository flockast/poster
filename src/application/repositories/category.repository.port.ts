import type { Category, CreateCategory, UpdateCategory } from '../entities/category.entity'

export interface CategoryRepositoryPort {
  findAll(): Promise<Category[]>
  findById(id: Category['id']): Promise<Category | undefined>
  findBySlug(slug: Category['slug']): Promise<Category | undefined>
  create(payload: CreateCategory): Promise<Category>
  update(id: Category['id'], payload: UpdateCategory): Promise<Category | undefined>
  delete(id: Category['id']): Promise<Category | undefined>
}
