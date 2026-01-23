import fp from 'fastify-plugin'
import type { UserRepositoryPort } from '@/application/repositories/user.repository.port'
import type { AuthenticationUser } from '@/application/services/authentication-user/authentication-user.service.types'
import type { AuthenticationUserServicePort } from '@/application/services/authentication-user/authentication-user.service.port'
import type { PasswordServicePort } from '@/application/services/password/password.service.port'
import type { User } from '@/application/entities/user.entity'
import { UserReadUseCase } from '@/application/use-cases/user/user-read.use-case'
import { UserWriteUseCase } from '@/application/use-cases/user/user-write.use-case'
import { UserRegistrationUseCase } from '@/application/use-cases/user/user-registration.use-case'
import { UserLoginUseCase } from '@/application/use-cases/user/user-login.use-case'
import { UserRepository } from '../repositories/user.repository'
import { AuthenticationUserService } from '../services/authentication-user.service'
import { PasswordService } from '../services/password.service'
import { createAuthenticateMiddleware } from '../middlewares/authenticate.middleware'
import { createPermissionMiddleware } from '../middlewares/permission.middleware'
import { DatabaseService } from '../services/database.service'
import { SeedService } from '../services/seed.service'
import { ConfigService } from '../services/config.service'

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

export default fp(async (app) => {
  const configService = new ConfigService()

  const databaseService = new DatabaseService(app.log, configService.getDatabase())
  await databaseService.init()

  const passwordService: PasswordServicePort = new PasswordService()

  const seedService = new SeedService(databaseService.get(), app.log, passwordService, configService.getRootAdmin())
  await seedService.createRootUser()

  const userRepository: UserRepositoryPort = new UserRepository(databaseService.get())
  const authenticationUserService: AuthenticationUserServicePort = new AuthenticationUserService(configService.getToken())

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

  app.addHook('onClose', () => databaseService.destroy())
})
