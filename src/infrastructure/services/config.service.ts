import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import type { ConfigServicePort } from '@/application/services/config/config.service.port'
import type { ConfigDatabase, ConfigToken, ConfigRootAdmin } from '@/application/services/config/config.service.types'

const EnvSchema = Type.Object({
  POSTGRES_HOST: Type.String(),
  POSTGRES_PORT: Type.String(),
  POSTGRES_USER: Type.String(),
  POSTGRES_PASSWORD: Type.String(),
  POSTGRES_DB: Type.String(),
  TOKEN_SECRET: Type.String(),
  TOKEN_EXPIRES_IN: Type.String(),
  ROOT_ADMIN_EMAIL: Type.Optional(Type.String()),
  ROOT_ADMIN_PASSWORD: Type.Optional(Type.String())
})

const env = Value.Decode(EnvSchema, process.env)

export class ConfigService implements ConfigServicePort {
  private readonly database: ConfigDatabase = {
    host: env.POSTGRES_HOST,
    port: Number(env.POSTGRES_PORT),
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB
  }

  private readonly token: ConfigToken = {
    secret: env.TOKEN_SECRET,
    expiresIn: env.TOKEN_EXPIRES_IN
  }

  private readonly rootAdmin: ConfigRootAdmin | null =
    env.ROOT_ADMIN_EMAIL && env.ROOT_ADMIN_PASSWORD
      ? { email: env.ROOT_ADMIN_EMAIL, password: env.ROOT_ADMIN_PASSWORD }
      : null

  getDatabase(): ConfigDatabase {
    return this.database
  }

  getToken(): ConfigToken {
    return this.token
  }

  getRootAdmin(): ConfigRootAdmin | null {
    return this.rootAdmin
  }
}
