import jwt from 'jsonwebtoken'
import type { FastifyRequest } from 'fastify'
import { AppErrorUnauthorized } from '@/application/commons/exceptions'
import { JwtTokenPayload } from '@/domain/entities/jwt.entity'
import { JwtRepositoryPort } from '@/domain/ports/jwt.port'

const extractToken = (request: FastifyRequest): string | null => {
  const authHeader = request.headers.authorization

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

export const createAuthMiddleware = (jwtRepository: JwtRepositoryPort) => async (request: FastifyRequest) => {
    try {
      const token = extractToken(request)

      if (!token) {
        throw new AppErrorUnauthorized('Не передан токен')
      }

      const payload = await jwtRepository.verify(token)

      request.user = payload as JwtTokenPayload
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
