import { type DB } from 'kysely-codegen'
import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { Kysely, PostgresDialect, sql } from 'kysely'
import fp from 'fastify-plugin'
import pg from 'pg'

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
  } catch (error) {
    fastify.log.error('Failed to connect to the database: ')
  }

  fastify.decorate('db', db)
  fastify.addHook('onClose', () => db.destroy())
})
