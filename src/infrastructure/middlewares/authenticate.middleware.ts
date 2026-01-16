import jwt from 'jsonwebtoken'
import type { FastifyRequest } from 'fastify'
import type { AuthenticationUserServicePort } from '@/application/services/authentication-user/authentication-user.port'
import { isAuthenticationUser } from '@/application/services/authentication-user/authentication-user.types'
import { AppErrorUnauthorized } from '@/application/exceptions'

const extractToken = (request: FastifyRequest): string | null => {
  const authHeader = request.headers.authorization

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

export const createAuthenticateMiddleware = (authenticationUserService: AuthenticationUserServicePort) => async (request: FastifyRequest) => {
  try {
    const token = extractToken(request)

    if (!token) {
      throw new AppErrorUnauthorized('Не передан токен')
    }

    const payload = await authenticationUserService.verify(token)

    if (isAuthenticationUser(payload)) {
      request.user = payload
    }
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppErrorUnauthorized('Неверный токен')
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new AppErrorUnauthorized('Токен устарел')
    }

    throw error
  }
}
