import fp from 'fastify-plugin'
import type { UserRepositoryPort } from '@/domain/ports/user.port'
import type { AuthenticationUser } from '@/application/services/authentication-user/authentication-user.types'
import type { AuthenticationUserServicePort } from '@/application/services/authentication-user/authentication-user.port'
import type { PasswordServicePort } from '@/application/services/password/password.port'
import type { User } from '@/domain/entities/user.entity'
import { UserReadUseCase } from '@/application/use-cases/user/user-read.use-case'
import { UserWriteUseCase } from '@/application/use-cases/user/user-write.use-case'
import { UserRegistrationUseCase } from '@/application/use-cases/user/user-registration.use-case'
import { UserLoginUseCase } from '@/application/use-cases/user/user-login.use-case'
import { UserRepository } from '../repositories/user.repository'
import { AuthenticationUserService } from '../services/authentication-user.service'
import { PasswordService } from '../services/password.service'
import { createAuthenticateMiddleware } from '../middlewares/authenticate.middleware'
import { createPermissionMiddleware } from '../middlewares/permission.middleware'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>
    permission: (roles: User['role'][]) => (request: FastifyRequest) => Promise<void>
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
  const authenticationUserService: AuthenticationUserServicePort = new AuthenticationUserService()
  const passwordService: PasswordServicePort = new PasswordService()

  const authenticateMiddleware = createAuthenticateMiddleware(authenticationUserService)
  app.decorate('authenticate', authenticateMiddleware)

  const permissionMiddleware = createPermissionMiddleware()
  app.decorate('permission', permissionMiddleware)

  const userReadUseCase = new UserReadUseCase(userRepository)
  app.decorate('userReadUseCase', userReadUseCase)

  const userWriteUseCase = new UserWriteUseCase(userRepository, passwordService)
  app.decorate('userWriteUseCase', userWriteUseCase)

  const userRegistrationUseCase = new UserRegistrationUseCase(userRepository, passwordService, authenticationUserService)
  app.decorate('userRegistrationUseCase', userRegistrationUseCase)

  const userLoginUseCase = new UserLoginUseCase(userRepository, passwordService, authenticationUserService)
  app.decorate('userLoginUseCase', userLoginUseCase)
})
