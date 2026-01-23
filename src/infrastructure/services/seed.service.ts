import type { Kysely } from 'kysely'
import type { DB } from 'kysely-codegen'
import type { FastifyBaseLogger } from 'fastify'
import type { PasswordServicePort } from '@/application/services/password/password.service.port'
import type { ConfigRootAdmin } from '@/application/services/config/config.service.types'

export class SeedService {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly logger: FastifyBaseLogger,
    private readonly passwordService: PasswordServicePort,
    private readonly config: ConfigRootAdmin | null
  ) {}

  async createRootUser(): Promise<void> {
    const email = this.config?.email
    const password = this.config?.password

    if (!email || !password) {
      this.logger.info('Root admin credentials not provided, skipping')
      return
    }

    try {
      const existing = await this.db
        .selectFrom('users')
        .select('id')
        .where('email', '=', email)
        .executeTakeFirst()

      if (!existing) {
        const passwordHash = await this.passwordService.hash(password)
        await this.db
          .insertInto('users')
          .values({
            email,
            password_hash: passwordHash,
            role: 'admin'
          })
          .execute()

        this.logger.info(`Created root admin user: ${email}`)
      } else {
        this.logger.info('Root admin user already exists')
      }
    } catch (error) {
      this.logger.error(error, 'Failed to create root admin user')
    }
  }
}
