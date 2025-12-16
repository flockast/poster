import { UserRepositoryPort } from '@/domain/ports/user.port'
import { JwtRepositoryPort } from '@/domain/ports/jwt.port'
import { PasswordRepositoryPort } from '@/domain/ports/password.port'
import { ExceptionAlreadyExisting, ExceptionInvalidLogin, ExceptionNotFound } from '../commons/exceptions'

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
      throw new ExceptionAlreadyExisting(`Пользователь с таким email (${payload.email}) уже существует`)
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
      throw new ExceptionInvalidLogin()
    }

    const verifiedPassword = await this.passwordRepository.verify(payload.password, user?.passwordHash)

    if (!verifiedPassword) {
      throw new ExceptionInvalidLogin()
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
      throw new ExceptionNotFound(`Пользователь email=${payload.email} не найден`)
    }

    return user
  }
}
