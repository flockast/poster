import type { AuthenticationUser } from './authentication-user.types'

export interface AuthenticationUserPort {
  sign(payload: AuthenticationUser): Promise<string>
  verify(token: string): Promise<AuthenticationUser>
}
