import { USER_ROLES } from '@/domain/entities/user.entity'
import type { UserRepositoryPort } from '@/domain/ports/user.port'
import type { AuthenticationUserServicePort } from '../../services/authentication-user/authentication-user.port'
import type { PasswordServicePort } from '../../services/password/password.port'
import { AppErrorAlreadyExisting } from '../../exceptions'
import { normalizeEmail } from '../../utilities/normalize-email.utility'

type RegistrationPayload = {
  email: string
  password: string
}

export class UserRegistrationUseCase {
  constructor (
    private readonly userRepository: UserRepositoryPort,
    private readonly  passwordService: PasswordServicePort,
    private readonly authenticationUserService: AuthenticationUserServicePort
  ) {}

  async execute(payload: RegistrationPayload) {
    const email = normalizeEmail(payload.email)
    const existingUser = await this.userRepository.findByEmail(email)

    if (existingUser) {
      throw new AppErrorAlreadyExisting(`Пользователь с таким email (${email}) уже существует`)
    }

    const passwordHash = await this.passwordService.hash(payload.password)

    const createUserPayload = {
      ...payload,
      email,
      passwordHash,
      role: USER_ROLES.USER
    }

    const user = await this.userRepository.create(createUserPayload)

    const token = await this.authenticationUserService.sign({
      id: user.id,
      email: user.email,
      role: user.role
    })

    return {
      user,
      token
    }
  }
}
