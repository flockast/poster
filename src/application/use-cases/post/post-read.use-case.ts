import type { PostRepositoryPort } from '@/application/repositories/post.repository.port'
import type { PaginationRequest, SortByRequest } from '@/application/common/type'
import type { Post } from '@/application/entities/post.entity'
import { AppErrorNotFound } from '../../common/exceptions'

export class PostReadUseCase {
  constructor (
    private readonly postRepository: PostRepositoryPort
  ) {}

  findAll(pagination: PaginationRequest, sortBy: SortByRequest<Post>) {
    return this.postRepository.findAll(pagination, sortBy)
  }

  async findById(payload: Post['id']) {
    const item = await this.postRepository.findById(payload)

    if (!item) {
      throw new AppErrorNotFound(`Статья id=${payload} не найдена`)
    }

    return item
  }

  async findBySlug(payload: Post['slug']) {
    const item = await this.postRepository.findBySlug(payload)

    if (!item) {
      throw new AppErrorNotFound(`Статья slug=${payload} не найдена`)
    }

    return item
  }
}
