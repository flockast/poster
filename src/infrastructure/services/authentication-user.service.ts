import jwt from 'jsonwebtoken'
import type { AuthenticationUserServicePort } from '@/application/services/authentication-user/authentication-user.service.port'
import { type AuthenticationUser, isAuthenticationUser } from '@/application/services/authentication-user/authentication-user.service.types'
import type { ConfigToken } from '@/application/services/config/config.service.types'
import { AppErrorUnauthorized } from '@/application/common/exceptions'

export class AuthenticationUserService implements AuthenticationUserServicePort {
  constructor(private readonly config: ConfigToken) {
    if (!this.config?.secret) {
      throw new Error('Не установлен TOKEN_SECRET')
    }

    if (!this.config?.expiresIn) {
      throw new Error('Не установлен TOKEN_EXPIRES_IN')
    }
  }

  async sign(payload: AuthenticationUser) {
    return jwt.sign(payload, this.config.secret, {
      expiresIn: this.config.expiresIn as jwt.SignOptions['expiresIn']
    })
  }

  async verify(token: string) {
    const payload = jwt.verify(token, this.config.secret)

    if (!isAuthenticationUser(payload)) {
      throw new AppErrorUnauthorized('Неверная структура токена')
    }

    return payload
  }
}
