import type { User } from '@/domain/entities/user.entity'

export type AuthenticationUser = Pick<User, 'id' | 'email' | 'role'>

export const isAuthenticationUser = (payload: unknown): payload is AuthenticationUser => {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }
  const p = payload as Record<string, unknown>
  return (
    typeof p.id === 'number' &&
    typeof p.email === 'string' &&
    typeof p.role === 'string'
  )
}
