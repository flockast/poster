import type { Post } from '@/application/entities/post.entity'
import type { CreatePostPayload, PostRepositoryPort, UpdatePostPayload } from '@/application/repositories/post.repository.port'
import { AppErrorNotFound, AppErrorAlreadyExisting } from '../../common/exceptions'

export class PostWriteUseCase {
  constructor (
    private readonly postRepository: PostRepositoryPort
  ) {}

  async update(id: Post['id'], payload: UpdatePostPayload) {
    if (payload.post.slug) {
      const existing = await this.postRepository.findBySlug(payload.post.slug)

      if (existing && existing.id !== id) {
        throw new AppErrorAlreadyExisting(`Статья с таким slug (${payload.post.slug}) уже существует`)
      }
    }

    const updatedItem = await this.postRepository.update(id, payload)

    if (!updatedItem) {
      throw new AppErrorNotFound(`Статья с id=${id} не найдена`)
    }

    return updatedItem
  }

  async create(payload: CreatePostPayload) {
    const existing = await this.postRepository.findBySlug(payload.post.slug)

    if (existing) {
      throw new AppErrorAlreadyExisting(`Статья с таким slug (${payload.post.slug}) уже существует`)
    }

    const createdItem = await this.postRepository.create(payload)

    return createdItem
  }

  async delete(id: Post['id']) {
    const item = await this.postRepository.delete(id)

    if (!item) {
      throw new AppErrorNotFound(`Статья с id=${id} не найдена`)
    }

    return item
  }
}
