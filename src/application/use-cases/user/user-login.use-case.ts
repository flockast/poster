import { UserRepositoryPort } from '@/domain/ports/user.port'
import { JwtRepositoryPort } from '@/domain/ports/jwt.port'
import { PasswordRepositoryPort } from '@/domain/ports/password.port'
import { AppErrorInvalidLogin } from '../../commons/exceptions'
import { normalizeEmail } from '../../commons/normalize-email'

type SingInPayload = {
  email: string
  password: string
}

export class UserLoginUseCase {
  constructor (
    private readonly userRepository: UserRepositoryPort,
    private readonly  passwordRepository: PasswordRepositoryPort,
    private readonly jwtRepository: JwtRepositoryPort
  ) {}

  async execute(payload: SingInPayload) {
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
}
