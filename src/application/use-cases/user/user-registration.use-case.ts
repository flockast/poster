import type { UserRepositoryPort } from '@/domain/ports/user.port'
import type { AuthenticationUserPort } from '../../features/authentication-user/authentication-user.port'
import type { PasswordPort } from '../../features/password/password.port'
import { AppErrorAlreadyExisting } from '../../exceptions'
import { normalizeEmail } from '../../utilities/normalize-email.utility'

type SignUpPayload = {
  email: string
  password: string
}

export class UserRegistrationUseCase {
  constructor (
    private readonly userRepository: UserRepositoryPort,
    private readonly  passwordService: PasswordPort,
    private readonly authenticationUserService: AuthenticationUserPort
  ) {}

  async execute(payload: SignUpPayload) {
    const normalizedEmail = normalizeEmail(payload.email)
    const existingUser = await this.userRepository.findByEmail(normalizedEmail)

    if (existingUser) {
      throw new AppErrorAlreadyExisting(`Пользователь с таким email (${normalizedEmail}) уже существует`)
    }

    const createUserPayload = {
      email: normalizedEmail,
      passwordHash: await this.passwordService.hash(payload.password)
    }

    const user = await this.userRepository.create(createUserPayload)
    const token = await this.authenticationUserService.sign({
      id: user.id,
      email: user.email
    })

    return {
      user,
      token
    }
  }
}
