import { type DB } from 'kysely-codegen'
import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { Kysely, PostgresDialect, sql } from 'kysely'
import fp from 'fastify-plugin'
import pg from 'pg'
import { PasswordService } from '../services/password.service'

const ConfigSchema = Type.Object({
  host: Type.String(),
  port: Type.Number(),
  user: Type.String(),
  password: Type.String(),
  database: Type.String()
})

const config = Value.Decode(ConfigSchema, {
  host: `${process.env.POSTGRES_HOST}`,
  port: Number(process.env.POSTGRES_PORT),
  user: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: `${process.env.POSTGRES_DB}`
})

declare module 'fastify' {
  interface FastifyInstance {
    db: Kysely<DB>
  }
}

export default fp(async (fastify) => {
  fastify.log.info('Connecting to database')

  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new pg.Pool(config)
    })
  })

  try {
    await sql`SELECT 1`.execute(db)
    fastify.log.info('Database connection successful!')
  } catch {
    fastify.log.error('Failed to connect to the database: ')
  }

  // 🔐 Создаём рутового админа, если переменные заданы
  if (process.env.ROOT_ADMIN_EMAIL && process.env.ROOT_ADMIN_PASSWORD) {
    const passwordService = new PasswordService()

    try {
      const existing = await db
        .selectFrom('users')
        .select('id')
        .where('email', '=', process.env.ROOT_ADMIN_EMAIL)
        .executeTakeFirst()

      if (!existing) {
        const passwordHash = await passwordService.hash(process.env.ROOT_ADMIN_PASSWORD)
        await db
          .insertInto('users')
          .values({
            email: process.env.ROOT_ADMIN_EMAIL,
            password_hash: passwordHash,
            role: 'admin'
          })
          .execute()

        fastify.log.info(`Created root admin user: ${process.env.ROOT_ADMIN_EMAIL}`)
      } else {
        fastify.log.info('Root admin user already exists')
      }
    } catch {
      fastify.log.error('Failed to create root admin user:')
    }
  }

  fastify.decorate('db', db)
  fastify.addHook('onClose', () => db.destroy())
})
