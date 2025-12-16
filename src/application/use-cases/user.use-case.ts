import { CreateUser, UpdateUser, User } from '@/domain/entities/user.entity'
import { UserRepositoryPort } from '@/domain/ports/user.port'
import { ExceptionAlreadyExisting, ExceptionNotFound } from '../commons/exceptions'

export class UserUseCase {
  constructor (private readonly userRepository: UserRepositoryPort) {}

  findAll() {
    return this.userRepository.findAll()
  }

  async findById(payload: User['id']) {
    const user = await this.userRepository.findById(payload)

    if (!user) {
      throw new ExceptionNotFound(`Пользователь id=${payload} не найден`)
    }

    return user
  }

  async findByEmail(payload: User['email']) {
    const user = await this.userRepository.findByEmail(payload)

    if (!user) {
      throw new ExceptionNotFound(`Пользователь email=${payload} не найден`)
    }

    return user
  }

  async update(id: User['id'], payload: UpdateUser) {
    if (payload.email) {
      const existing = await this.userRepository.findByEmail(payload.email)

      if (existing && existing.id !== id) {
        throw new ExceptionAlreadyExisting(`Пользователь с таким email (${payload.email}) уже существует`)
      }
    }

    const user = await this.userRepository.update(id, payload)

    if (!user) {
      throw new ExceptionNotFound(`Пользователь с id=${id} не найден`)
    }

    return user
  }

  async delete(id: User['id']) {
    const user = await this.userRepository.delete(id)

    if (!user) {
      throw new ExceptionNotFound(`Пользователь с id=${id} не найден`)
    }

    return user
  }

  // async create(payload: CreateUser) {
  //   const existingUser = await this.userRepository.findByEmail(payload.email)

  //   if (existingUser) {
  //     throw new ExceptionAlreadyExisting(`Пользователь с таким email (${payload.email}) уже существует`)
  //   }

  //   return this.userRepository.create(payload)
  // }
}
