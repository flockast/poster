import { User } from '@/domain/entities/user.entity'
import { UserRepositoryPort } from '@/domain/ports/user.port'
import { AppErrorNotFound } from '../../commons/exceptions'
import { normalizeEmail } from '../../commons/normalize-email'

export class UserReadUseCase {
  constructor (
    private readonly userRepository: UserRepositoryPort,
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
