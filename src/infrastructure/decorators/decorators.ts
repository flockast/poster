import fp from 'fastify-plugin'
import type { UserRepositoryPort } from '@/application/repositories/user.repository.port'
import type { AuthenticationUser } from '@/application/services/authentication-user/authentication-user.service.types'
import type { AuthenticationUserServicePort } from '@/application/services/authentication-user/authentication-user.service.port'
import type { PasswordServicePort } from '@/application/services/password/password.service.port'
import type { User } from '@/application/entities/user.entity'
import type { ConfigServicePort } from '@/application/services/config/config.service.port'
import type { CategoryRepositoryPort } from '@/application/repositories/category.repository.port'
import type { TagRepositoryPort } from '@/application/repositories/tag.repository.port'
import type { PostRepositoryPort } from '@/application/repositories/post.repository.port'
import { UserReadUseCase } from '@/application/use-cases/user/user-read.use-case'
import { UserWriteUseCase } from '@/application/use-cases/user/user-write.use-case'
import { UserRegistrationUseCase } from '@/application/use-cases/user/user-registration.use-case'
import { UserLoginUseCase } from '@/application/use-cases/user/user-login.use-case'
import { CategoryReadUseCase } from '@/application/use-cases/category/category-read.use-case'
import { CategoryWriteUseCase } from '@/application/use-cases/category/category-write.use-case'
import { TagReadUseCase } from '@/application/use-cases/tag/tag-read.use-case'
import { TagWriteUseCase } from '@/application/use-cases/tag/tag-write.use-case'
import { PostReadUseCase } from '@/application/use-cases/post/post-read.use-case'
import { PostWriteUseCase } from '@/application/use-cases/post/post-write.use-case'
import { ConfigService } from '../services/config.service'
import { DatabaseService } from '../services/database.service'
import { PasswordService } from '../services/password.service'
import { SeedService } from '../services/seed.service'
import { AuthenticationUserService } from '../services/authentication-user.service'
import { UserRepository } from '../repositories/user.repository'
import { CategoryRepository } from '../repositories/category.repository'
import { TagRepository } from '../repositories/tag.repository'
import { createAuthenticateMiddleware } from '../middlewares/authenticate.middleware'
import { createPermissionMiddleware } from '../middlewares/permission.middleware'
import { PostRepository } from '../repositories/post.repository'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>
    permission: (roles: User['role'][]) => (request: FastifyRequest) => Promise<void>

    userReadUseCase: UserReadUseCase
    userWriteUseCase: UserWriteUseCase
    userRegistrationUseCase: UserRegistrationUseCase
    userLoginUseCase: UserLoginUseCase

    categoryReadUseCase: CategoryReadUseCase
    categoryWriteUseCase: CategoryWriteUseCase

    tagReadUseCase: TagReadUseCase
    tagWriteUseCase: TagWriteUseCase

    postReadUseCase: PostReadUseCase
    postWriteUseCase: PostWriteUseCase
  }

  interface FastifyRequest {
    user?: AuthenticationUser
  }
}

export default fp(async (app) => {
  const configService: ConfigServicePort = new ConfigService()

  const databaseService = new DatabaseService(app.log, configService.getDatabase())
  await databaseService.init()

  const passwordService: PasswordServicePort = new PasswordService()

  const seedService = new SeedService(databaseService.get(), app.log, passwordService, configService.getRootAdmin())
  await seedService.createRootUser()

  const authenticationUserService: AuthenticationUserServicePort = new AuthenticationUserService(configService.getToken())

  const authenticateMiddleware = createAuthenticateMiddleware(authenticationUserService)
  app.decorate('authenticate', authenticateMiddleware)

  const permissionMiddleware = createPermissionMiddleware()
  app.decorate('permission', permissionMiddleware)

  const userRepository: UserRepositoryPort = new UserRepository(databaseService.get())

  const userReadUseCase = new UserReadUseCase(userRepository)
  app.decorate('userReadUseCase', userReadUseCase)

  const userWriteUseCase = new UserWriteUseCase(userRepository, passwordService)
  app.decorate('userWriteUseCase', userWriteUseCase)

  const userRegistrationUseCase = new UserRegistrationUseCase(userRepository, passwordService, authenticationUserService)
  app.decorate('userRegistrationUseCase', userRegistrationUseCase)

  const userLoginUseCase = new UserLoginUseCase(userRepository, passwordService, authenticationUserService)
  app.decorate('userLoginUseCase', userLoginUseCase)

  const categoryRepository: CategoryRepositoryPort = new CategoryRepository(databaseService.get())

  const categoryReadUseCase = new CategoryReadUseCase(categoryRepository)
  app.decorate('categoryReadUseCase', categoryReadUseCase)

  const categoryWriteUseCase = new CategoryWriteUseCase(categoryRepository)
  app.decorate('categoryWriteUseCase', categoryWriteUseCase)

  const tagRepository: TagRepositoryPort = new TagRepository(databaseService.get())

  const tagReadUseCase = new TagReadUseCase(tagRepository)
  app.decorate('tagReadUseCase', tagReadUseCase)

  const tagWriteUseCase = new TagWriteUseCase(tagRepository)
  app.decorate('tagWriteUseCase', tagWriteUseCase)

  const postRepository: PostRepositoryPort = new PostRepository(databaseService.get())

  const postReadUseCase = new PostReadUseCase(postRepository)
  app.decorate('postReadUseCase', postReadUseCase)

  const postWriteUseCase = new PostWriteUseCase(postRepository)
  app.decorate('postWriteUseCase', postWriteUseCase)

  app.addHook('onClose', () => databaseService.destroy())
})
