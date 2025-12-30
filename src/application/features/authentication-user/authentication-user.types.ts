export type AuthenticationUser = {
  id: number
  email: string
}

export const isAuthenticationUser = (payload: unknown): payload is AuthenticationUser => {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }
  const p = payload as Record<string, any>
  return (
    typeof p.id === 'number' &&
    typeof p.email === 'string' &&
    p.email.length > 0
  )
}
