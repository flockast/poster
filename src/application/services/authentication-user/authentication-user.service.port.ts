import type { AuthenticationUser } from './authentication-user.service.types'

export interface AuthenticationUserServicePort {
  sign(payload: AuthenticationUser): Promise<string>
  verify(token: string): Promise<AuthenticationUser>
}
