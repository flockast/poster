import jwt from 'jsonwebtoken'
import { isJwtTokenPayload, type JwtTokenPayload } from '@/domain/entities/jwt.entity'
import { JwtRepositoryPort } from '@/domain/ports/jwt.port'

export class JwtRepository implements JwtRepositoryPort {
  async sign(payload: JwtTokenPayload) {
    return jwt.sign(payload, process.env.JWT_SECRET!)
  }

  async verify(token: string) {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)

    if (!isJwtTokenPayload(payload)) {
      throw new Error('Неверная структура токена')
    }

    return payload
  }
}
