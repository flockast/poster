import type { Tag } from '@/application/entities/tag.entity'
import type { TagRepositoryPort } from '@/application/repositories/tag.repository.port'
import { AppErrorNotFound } from '../../common/exceptions'

export class TagReadUseCase {
  constructor (
    private readonly tagRepository: TagRepositoryPort
  ) {}

  findAll() {
    return this.tagRepository.findAll()
  }

  async findById(payload: Tag['id']) {
    const item = await this.tagRepository.findById(payload)

    if (!item) {
      throw new AppErrorNotFound(`Тег id=${payload} не найден`)
    }

    return item
  }

  async findBySlug(payload: Tag['slug']) {
    const item = await this.tagRepository.findBySlug(payload)

    if (!item) {
      throw new AppErrorNotFound(`Тег slug=${payload} не найден`)
    }

    return item
  }
}
