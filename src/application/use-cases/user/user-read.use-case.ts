import type { User } from '@/application/entities/user.entity'
import type { UserRepositoryPort } from '@/application/repositories/user.repository.port'
import { AppErrorNotFound } from '../../exceptions'
import { normalizeEmail } from '../../utilities/normalize-email.utility'

export class UserReadUseCase {
  constructor (
    private readonly userRepository: UserRepositoryPort
  ) {}

  findAll() {
    return this.userRepository.findAll()
  }

  async findById(payload: User['id']) {
    const user = await this.userRepository.findById(payload)

    if (!user) {
      throw new AppErrorNotFound(`Пользователь id=${payload} не найден`)
    }

    return user
  }

  async findByEmail(payload: User['email']) {
    const user = await this.userRepository.findByEmail(normalizeEmail(payload))

    if (!user) {
      throw new AppErrorNotFound(`Пользователь email=${payload} не найден`)
    }

    return user
  }
}
