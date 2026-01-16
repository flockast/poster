import jwt from 'jsonwebtoken'
import type { AuthenticationUserServicePort } from '@/application/services/authentication-user/authentication-user.port'
import { type AuthenticationUser, isAuthenticationUser } from '@/application/services/authentication-user/authentication-user.types'
import { AppErrorUnauthorized } from '@/application/exceptions'

export class AuthenticationUserService implements AuthenticationUserServicePort {
  private readonly config = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  }

  constructor() {
    if (!this.config.secret) {
      throw new Error('Не установлен JWT_SECRET')
    }

    if (!this.config.expiresIn) {
      throw new Error('Не установлен JWT_EXPIRES_IN')
    }
  }

  async sign(payload: AuthenticationUser) {
    return jwt.sign(payload, this.config.secret!, {
      expiresIn: this.config.expiresIn as jwt.SignOptions['expiresIn']
    })
  }

  async verify(token: string) {
    const payload = jwt.verify(token, this.config.secret!)

    if (!isAuthenticationUser(payload)) {
      throw new AppErrorUnauthorized('Неверная структура токена')
    }

    return payload
  }
}
