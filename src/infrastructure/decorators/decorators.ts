import fp from 'fastify-plugin'
import type { UserRepositoryPort } from '@/domain/ports/user.port'
import type { AuthenticationUser } from '@/application/features/authentication-user/authentication-user.types'
import type { AuthenticationUserPort } from '@/application/features/authentication-user/authentication-user.port'
import type { PasswordPort } from '@/application/features/password/password.port'
import { UserReadUseCase } from '@/application/use-cases/user/user-read.use-case'
import { UserWriteUseCase } from '@/application/use-cases/user/user-write.use-case'
import { UserRegistrationUseCase } from '@/application/use-cases/user/user-registration.use-case'
import { UserLoginUseCase } from '@/application/use-cases/user/user-login.use-case'
import { UserRepository } from '../repositories/user.repository'
import { AuthenticationUserService } from '../services/authentication-user.service'
import { PasswordService } from '../services/password.service'
import { createAuthenticateMiddleware } from '../middlewares/authenticate.middleware'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>
    userReadUseCase: UserReadUseCase
    userWriteUseCase: UserWriteUseCase
    userRegistrationUseCase: UserRegistrationUseCase
    userLoginUseCase: UserLoginUseCase
  }

  interface FastifyRequest {
    user?: AuthenticationUser
  }
}

export default fp((app) => {
  const userRepository: UserRepositoryPort = new UserRepository(app.db)
  const authenticationUserService: AuthenticationUserPort = new AuthenticationUserService()
  const passwordService: PasswordPort = new PasswordService()

  const authenticateMiddleware = createAuthenticateMiddleware(authenticationUserService)
  app.decorate('authenticate', authenticateMiddleware)

  const userReadUseCase = new UserReadUseCase(userRepository)
  app.decorate('userReadUseCase', userReadUseCase)

  const userWriteUseCase = new UserWriteUseCase(userRepository, passwordService)
  app.decorate('userWriteUseCase', userWriteUseCase)

  const userRegistrationUseCase = new UserRegistrationUseCase(userRepository, passwordService, authenticationUserService)
  app.decorate('userRegistrationUseCase', userRegistrationUseCase)

  const userLoginUseCase = new UserLoginUseCase(userRepository, passwordService, authenticationUserService)
  app.decorate('userLoginUseCase', userLoginUseCase)
})
