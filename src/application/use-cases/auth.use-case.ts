import { UserRepositoryPort } from '@/domain/ports/user.port'
import { JwtRepositoryPort } from '@/domain/ports/jwt.port'
import { PasswordRepositoryPort } from '@/domain/ports/password.port'
import { AppErrorNotFound, AppErrorAlreadyExisting, AppErrorInvalidLogin } from '../commons/exceptions'

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
    const existingUser = await this.userRepository.findByEmail(payload.email)

    if (existingUser) {
      throw new AppErrorAlreadyExisting(`Пользователь с таким email (${payload.email}) уже существует`)
    }

    const payloadCreateUser = {
      ...payload,
      passwordHash: await this.passwordRepository.hash(payload.password)
    }

    const user = await this.userRepository.create(payloadCreateUser)
    const token = await this.jwtRepository.sign({ email: user.email })

    return {
      user,
      token
    }
  }

  async signIn(payload: SingInPayload) {
    const user = await this.userRepository.findByEmail(payload.email)

    if (!user) {
      throw new AppErrorInvalidLogin()
    }

    const verifiedPassword = await this.passwordRepository.verify(payload.password, user?.passwordHash)

    if (!verifiedPassword) {
      throw new AppErrorInvalidLogin()
    }

    const token = await this.jwtRepository.sign({ email: user.email })

    return {
      user,
      token
    }
  }

  async me(payload: { email: string }) {
    const user = await this.userRepository.findByEmail(payload.email)

    if (!user) {
      throw new AppErrorNotFound(`Пользователь email=${payload.email} не найден`)
    }

    return user
  }
}
