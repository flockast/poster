import type { CategoryRepositoryPort } from '@/application/repositories/category.repository.port'
import type { Category, CreateCategory, UpdateCategory } from '@/application/entities/category.entity'
import { AppErrorNotFound, AppErrorAlreadyExisting } from '../../common/exceptions'

export class CategoryWriteUseCase {
  constructor (
    private readonly categoryRepository: CategoryRepositoryPort
  ) {}

  async update(id: Category['id'], payload: UpdateCategory) {
    const updatePayload: UpdateCategory = {}

    if (payload.slug) {
      const existing = await this.categoryRepository.findBySlug(payload.slug)

      if (existing && existing.id !== id) {
        throw new AppErrorAlreadyExisting(`Категория с таким slug (${payload.slug}) уже существует`)
      }

      updatePayload.slug = payload.slug
    }

    if (payload.title) {
      updatePayload.title = payload.title
    }

    if (payload.description) {
      updatePayload.description = payload.description
    }

    const updatedItem = await this.categoryRepository.update(id, updatePayload)

    if (!updatedItem) {
      throw new AppErrorNotFound(`Категория с id=${id} не найдена`)
    }

    return updatedItem
  }

  async create(payload: CreateCategory) {
    const existing = await this.categoryRepository.findBySlug(payload.slug)

    if (existing) {
      throw new AppErrorAlreadyExisting(`Категория с таким slug (${payload.slug}) уже существует`)
    }

    const createdItem = await this.categoryRepository.create(payload)

    return createdItem
  }

  async delete(id: Category['id']) {
    const item = await this.categoryRepository.delete(id)

    if (!item) {
      throw new AppErrorNotFound(`Категория с id=${id} не найдена`)
    }

    return item
  }
}
