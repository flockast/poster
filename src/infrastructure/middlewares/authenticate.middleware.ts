import jwt from 'jsonwebtoken'
import type { FastifyRequest } from 'fastify'
import { AppErrorUnauthorized } from '@/application/exceptions'
import type { AuthenticationUser } from '@/application/features/authentication-user/authentication-user.types'
import type { AuthenticationUserPort } from '@/application/features/authentication-user/authentication-user.port'

const extractToken = (request: FastifyRequest): string | null => {
  const authHeader = request.headers.authorization

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

export const createAuthenticateMiddleware = (authenticationUserService: AuthenticationUserPort) => async (request: FastifyRequest) => {
    try {
      const token = extractToken(request)

      if (!token) {
        throw new AppErrorUnauthorized('Не передан токен')
      }

      const payload = await authenticationUserService.verify(token)

      request.user = payload as AuthenticationUser
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
