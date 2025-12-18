import { UserRepositoryPort } from '@/domain/ports/user.port'
import { JwtRepositoryPort } from '@/domain/ports/jwt.port'
import { PasswordRepositoryPort } from '@/domain/ports/password.port'
import { AppErrorAlreadyExisting } from '../../commons/exceptions'
import { normalizeEmail } from '../../commons/normalize-email'

type SignUpPayload = {
  email: string
  password: string
}

export class UserRegistrationUseCase {
  constructor (
    private readonly userRepository: UserRepositoryPort,
    private readonly  passwordRepository: PasswordRepositoryPort,
    private readonly jwtRepository: JwtRepositoryPort
  ) {}

  async execute(payload: SignUpPayload) {
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
}
