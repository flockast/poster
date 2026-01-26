import type { Tag, CreateTag, UpdateTag } from '@/application/entities/tag.entity'
import type { TagRepositoryPort } from '@/application/repositories/tag.repository.port'
import { AppErrorNotFound, AppErrorAlreadyExisting } from '../../common/exceptions'

export class TagWriteUseCase {
  constructor (
    private readonly tagRepository: TagRepositoryPort
  ) {}

  async update(id: Tag['id'], payload: UpdateTag) {
    const updatePayload: UpdateTag = {}

    if (payload.slug) {
      const existing = await this.tagRepository.findBySlug(payload.slug)

      if (existing && existing.id !== id) {
        throw new AppErrorAlreadyExisting(`Тег с таким slug (${payload.slug}) уже существует`)
      }

      updatePayload.slug = payload.slug
    }

    if (payload.title) {
      updatePayload.title = payload.title
    }

    const updatedItem = await this.tagRepository.update(id, updatePayload)

    if (!updatedItem) {
      throw new AppErrorNotFound(`Тег с id=${id} не найдена`)
    }

    return updatedItem
  }

  async create(payload: CreateTag) {
    const existing = await this.tagRepository.findBySlug(payload.slug)

    if (existing) {
      throw new AppErrorAlreadyExisting(`Тег с таким slug (${payload.slug}) уже существует`)
    }

    const createdItem = await this.tagRepository.create(payload)

    return createdItem
  }

  async delete(id: Tag['id']) {
    const item = await this.tagRepository.delete(id)

    if (!item) {
      throw new AppErrorNotFound(`Тег с id=${id} не найден`)
    }

    return item
  }
}
