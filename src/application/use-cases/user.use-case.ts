import { UpdateUser, User } from '@/domain/entities/user.entity'
import { UserRepositoryPort } from '@/domain/ports/user.port'
import { PasswordRepositoryPort } from '@/domain/ports/password.port'
import { AppErrorNotFound, AppErrorAlreadyExisting } from '../commons/exceptions'

type UpdateUserPayload = Partial<{
  email: string
  password: string
}>

export class UserUseCase {
  constructor (
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordRepository: PasswordRepositoryPort
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
    const user = await this.userRepository.findByEmail(payload)

    if (!user) {
      throw new AppErrorNotFound(`Пользователь email=${payload} не найден`)
    }

    return user
  }

  async update(id: User['id'], payload: UpdateUserPayload) {
    if (payload.email) {
      const existing = await this.userRepository.findByEmail(payload.email)

      if (existing && existing.id !== id) {
        throw new AppErrorAlreadyExisting(`Пользователь с таким email (${payload.email}) уже существует`)
      }
    }

    const updateData: UpdateUser = {
      email: payload.email
    }

    if (payload.password) {
      updateData.passwordHash = await this.passwordRepository.hash(payload.password)
    }

    const user = await this.userRepository.update(id, updateData)

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
