import type { UpdateUser, User } from '@/domain/entities/user.entity'
import type { UserRepositoryPort } from '@/domain/ports/user.port'
import type { PasswordServicePort } from '../../services/password/password.port'
import { normalizeEmail } from '../../utilities/normalize-email.utility'
import { AppErrorNotFound, AppErrorAlreadyExisting } from '../../exceptions'

type CreateUserPayload = {
  email: string
  password: string,
  role: User['role']
}

type UpdateUserPayload = Partial<CreateUserPayload>

export class UserWriteUseCase {
  constructor (
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordService: PasswordServicePort
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
      updateUserPayload.passwordHash = await this.passwordService.hash(payload.password)
    }

    if (payload.role) {
      updateUserPayload.role = payload.role
    }

    const user = await this.userRepository.update(id, updateUserPayload)

    if (!user) {
      throw new AppErrorNotFound(`Пользователь с id=${id} не найден`)
    }

    return user
  }

  async create(payload: CreateUserPayload) {
    const email = normalizeEmail(payload.email)
    const existing = await this.userRepository.findByEmail(email)

    if (existing) {
      throw new AppErrorAlreadyExisting(`Пользователь с таким email (${email}) уже существует`)
    }

    const passwordHash = await this.passwordService.hash(payload.password)

    const newUser = await this.userRepository.create({
      ...payload,
      email,
      passwordHash
    })

    return newUser
  }

  async delete(id: User['id']) {
    const user = await this.userRepository.delete(id)

    if (!user) {
      throw new AppErrorNotFound(`Пользователь с id=${id} не найден`)
    }

    return user
  }
}
