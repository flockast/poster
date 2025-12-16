import { JwtTokenPayload } from '../entities/jwt.entity'

export interface JwtRepositoryPort {
  sign(payload: JwtTokenPayload): Promise<string>
  verify(token: string): Promise<JwtTokenPayload>
}
