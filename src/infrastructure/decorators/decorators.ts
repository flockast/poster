import fp from 'fastify-plugin'
import { JwtTokenPayload } from '@/domain/entities/jwt.entity'
import { UserRepositoryPort } from '@/domain/ports/user.port'
import { JwtRepositoryPort } from '@/domain/ports/jwt.port'
import { UserReadUseCase } from '@/application/use-cases/user/user-read.use-case'
import { UserWriteUseCase } from '@/application/use-cases/user/user-write.use-case'
import { UserRegistrationUseCase } from '@/application/use-cases/user/user-registration.use-case'
import { UserLoginUseCase } from '@/application/use-cases/user/user-login.use-case'
import { UserRepository } from '../repositories/user.repository'
import { JwtRepository } from '../repositories/jwt.repository'
import { createAuthMiddleware } from '../middlewares/auth.middleware'
import { PasswordRepositoryPort } from '@/domain/ports/password.port'
import { PasswordRepository } from '../repositories/password.repository'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>
    userReadUseCase: UserReadUseCase
    userWriteUseCase: UserWriteUseCase
    userRegistrationUseCase: UserRegistrationUseCase
    userLoginUseCase: UserLoginUseCase
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

  const userReadUseCase = new UserReadUseCase(userRepository)
  app.decorate('userReadUseCase', userReadUseCase)

  const userWriteUseCase = new UserWriteUseCase(userRepository, passwordRepository)
  app.decorate('userWriteUseCase', userWriteUseCase)

  const userRegistrationUseCase = new UserRegistrationUseCase(userRepository, passwordRepository, jwtRepository)
  app.decorate('userRegistrationUseCase', userRegistrationUseCase)

  const userLoginUseCase = new UserLoginUseCase(userRepository, passwordRepository, jwtRepository)
  app.decorate('userLoginUseCase', userLoginUseCase)
})
