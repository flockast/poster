import type { ConfigDatabase, ConfigToken, ConfigRootAdmin } from './config.service.types'

export interface ConfigServicePort {
  getDatabase(): ConfigDatabase
  getToken(): ConfigToken
  getRootAdmin(): ConfigRootAdmin | null
}
