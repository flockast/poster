import type { UserRepositoryPort } from '@/domain/ports/user.port'
import type { AuthenticationUserPort } from '../../features/authentication-user/authentication-user.port'
import type { PasswordPort } from '../../features/password/password.port'
import { AppErrorInvalidLogin } from '../../exceptions'
import { normalizeEmail } from '../../utilities/normalize-email.utility'

type SingInPayload = {
  email: string
  password: string
}

export class UserLoginUseCase {
  constructor (
    private readonly userRepository: UserRepositoryPort,
    private readonly  passwordService: PasswordPort,
    private readonly authenticationUserService: AuthenticationUserPort
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
      email: user.email
    })

    return {
      user,
      token
    }
  }
}
