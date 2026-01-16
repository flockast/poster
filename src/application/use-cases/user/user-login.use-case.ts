import type { UserRepositoryPort } from '@/domain/ports/user.port'
import type { AuthenticationUserServicePort } from '../../services/authentication-user/authentication-user.port'
import type { PasswordServicePort } from '../../services/password/password.port'
import { AppErrorInvalidLogin } from '../../exceptions'
import { normalizeEmail } from '../../utilities/normalize-email.utility'

type SingInPayload = {
  email: string
  password: string
}

export class UserLoginUseCase {
  constructor (
    private readonly userRepository: UserRepositoryPort,
    private readonly  passwordService: PasswordServicePort,
    private readonly authenticationUserService: AuthenticationUserServicePort
  ) {}

  async execute(payload: SingInPayload) {
    const user = await this.userRepository.findByEmail(normalizeEmail(payload.email))

    if (!user) {
      throw new AppErrorInvalidLogin()
    }

    const verifiedPassword = await this.passwordService.verify(payload.password, user.passwordHash)

    if (!verifiedPassword) {
      throw new AppErrorInvalidLogin()
    }

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
