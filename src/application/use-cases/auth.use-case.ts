import { UserRepositoryPort } from '@/domain/ports/user.port'
import { JwtRepositoryPort } from '@/domain/ports/jwt.port'
import { PasswordRepositoryPort } from '@/domain/ports/password.port'
import { AppErrorNotFound, AppErrorAlreadyExisting, AppErrorInvalidLogin } from '../commons/exceptions'
import { normalizeEmail } from '../commons/normalize-email'
import { User } from '@/domain/entities/user.entity'

type SignUpPayload = {
  email: string
  password: string
}

type SingInPayload = {
  email: string
  password: string
}

export class AuthUseCase {
  constructor (
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtRepository: JwtRepositoryPort,
    private readonly  passwordRepository: PasswordRepositoryPort
  ) {}

  async signUp(payload: SignUpPayload) {
    const normalizedEmail = normalizeEmail(payload.email)
    const existingUser = await this.userRepository.findByEmail(normalizedEmail)

    if (existingUser) {
      throw new AppErrorAlreadyExisting(`Пользователь с таким email (${normalizedEmail}) уже существует`)
    }

    const createUserPayload = {
      email: normalizedEmail,
      passwordHash: await this.passwordRepository.hash(payload.password)
    }

    const user = await this.userRepository.create(createUserPayload)
    const token = await this.jwtRepository.sign({
      id: user.id,
      email: user.email
    })

    return {
      user,
      token
    }
  }

  async signIn(payload: SingInPayload) {
    const user = await this.userRepository.findByEmail(normalizeEmail(payload.email))

    if (!user) {
      throw new AppErrorInvalidLogin()
    }

    const verifiedPassword = await this.passwordRepository.verify(payload.password, user?.passwordHash)

    if (!verifiedPassword) {
      throw new AppErrorInvalidLogin()
    }

    const token = await this.jwtRepository.sign({
      id: user.id,
      email: user.email
    })

    return {
      user,
      token
    }
  }

  async me(id: User['id'] | undefined) {
    if (!id) {
      throw new AppErrorNotFound(`Пользователь id=${id} не найден`)
    }

    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new AppErrorNotFound(`Пользователь id=${id} не найден`)
    }

    return user
  }
}
