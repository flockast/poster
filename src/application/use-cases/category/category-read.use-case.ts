import type { Category } from '@/application/entities/category.entity'
import type { CategoryRepositoryPort } from '@/application/repositories/category.repository.port'
import { AppErrorNotFound } from '../../common/exceptions'

export class CategoryReadUseCase {
  constructor (
    private readonly categoryRepository: CategoryRepositoryPort
  ) {}

  findAll() {
    return this.categoryRepository.findAll()
  }

  async findById(payload: Category['id']) {
    const item = await this.categoryRepository.findById(payload)

    if (!item) {
      throw new AppErrorNotFound(`Категория id=${payload} не найдена`)
    }

    return item
  }

  async findBySlug(payload: Category['slug']) {
    const item = await this.categoryRepository.findBySlug(payload)

    if (!item) {
      throw new AppErrorNotFound(`Категория slug=${payload} не найдена`)
    }

    return item
  }
}
