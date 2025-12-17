import jwt from 'jsonwebtoken'
import { isJwtTokenPayload, type JwtTokenPayload } from '@/domain/entities/jwt.entity'
import { JwtRepositoryPort } from '@/domain/ports/jwt.port'

export class JwtRepository implements JwtRepositoryPort {
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

  async sign(payload: JwtTokenPayload) {
    return jwt.sign(payload, this.config.secret!, {
      expiresIn: this.config.expiresIn as jwt.SignOptions['expiresIn']
    })
  }

  async verify(token: string) {
    const payload = jwt.verify(token, this.config.secret!)

    if (!isJwtTokenPayload(payload)) {
      throw new Error('Неверная структура токена')
    }

    return payload
  }
}
