import { UpdateUser, User } from '@/domain/entities/user.entity'
import { UserRepositoryPort } from '@/domain/ports/user.port'
import { PasswordRepositoryPort } from '@/domain/ports/password.port'
import { AppErrorNotFound, AppErrorAlreadyExisting } from '../../commons/exceptions'
import { normalizeEmail } from '../../commons/normalize-email'

type UpdateUserPayload = Partial<{
  email: string
  password: string
}>

export class UserWriteUseCase {
  constructor (
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordRepository: PasswordRepositoryPort
  ) {}

  async update(id: User['id'], payload: UpdateUserPayload) {
    const updateUserPayload: UpdateUser = {}

    if (payload.email) {
      const normalizedEmail = normalizeEmail(payload.email)
      const existing = await this.userRepository.findByEmail(normalizedEmail)

      if (existing && existing.id !== id) {
        throw new AppErrorAlreadyExisting(`Пользователь с таким email (${normalizedEmail}) уже существует`)
      }

      updateUserPayload.email = normalizedEmail
    }

    if (payload.password) {
      updateUserPayload.passwordHash = await this.passwordRepository.hash(payload.password)
    }

    const user = await this.userRepository.update(id, updateUserPayload)

    if (!user) {
      throw new AppErrorNotFound(`Пользователь с id=${id} не найден`)
    }

    return user
  }

  async delete(id: User['id']) {
    const user = await this.userRepository.delete(id)

    if (!user) {
      throw new AppErrorNotFound(`Пользователь с id=${id} не найден`)
    }

    return user
  }
}
