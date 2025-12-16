export type JwtTokenPayload = {
  email: string
}

export const isJwtTokenPayload = (payload: unknown): payload is JwtTokenPayload => {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }
  const p = payload as Record<string, any>
  return (
    typeof p.email === 'string' &&
    p.email.length > 0
  )
}
