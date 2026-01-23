import type { FastifyBaseLogger } from 'fastify'
import { Kysely, PostgresDialect, sql } from 'kysely'
import type { DB } from 'kysely-codegen'
import PG from 'pg'
import type { ConfigDatabase } from '@/application/services/config/config.service.types'

export class DatabaseService {
  private db: Kysely<DB> | null = null

  constructor(
    private readonly logger: FastifyBaseLogger,
    private readonly config: ConfigDatabase
  ) {}

  async init(): Promise<Kysely<DB>> {
    this.logger.info('Connecting to database')

    this.db = new Kysely({
      dialect: new PostgresDialect({
        pool: new PG.Pool(this.config)
      })
    })

    try {
      await sql`SELECT 1`.execute(this.db)
      this.logger.info('Database connection successful!')
      return this.db
    } catch (error) {
      this.logger.error(error, 'Failed to connect to database')
      throw error
    }
  }

  async destroy(): Promise<void> {
    if (this.db) {
      await this.db.destroy()
    }
  }

  get(): Kysely<DB> {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.')
    }
    return this.db
  }

  getConfig() {
    return { ...this.config }
  }
}
