import fp from 'fastify-plugin'
import { JwtTokenPayload } from '@/domain/entities/jwt.entity'
import { UserRepositoryPort } from '@/domain/ports/user.port'
import { JwtRepositoryPort } from '@/domain/ports/jwt.port'
import { UserUseCase } from '@/application/use-cases/user.use-case'
import { AuthUseCase } from '@/application/use-cases/auth.use-case'
import { UserRepository } from '../repositories/user.repository'
import { JwtRepository } from '../repositories/jwt.repository'
import { createAuthMiddleware } from '../middlewares/auth.middleware'
import { PasswordRepositoryPort } from '@/domain/ports/password.port'
import { PasswordRepository } from '../repositories/password.repository'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>
    userUseCase: UserUseCase
    authUseCase: AuthUseCase
  }

  interface FastifyRequest {
    user?: JwtTokenPayload
  }
}

export default fp(async (app) => {
  const userRepository: UserRepositoryPort = new UserRepository(app.db)
  const jwtRepository: JwtRepositoryPort = new JwtRepository()
  const passwordRepository: PasswordRepositoryPort = new PasswordRepository()

  const authMiddleware = createAuthMiddleware(jwtRepository)
  app.decorate('authenticate', authMiddleware)

  const userUseCase = new UserUseCase(userRepository)
  app.decorate('userUseCase', userUseCase)

  const authUseCase = new AuthUseCase(userRepository, jwtRepository, passwordRepository)
  app.decorate('authUseCase', authUseCase)
})
