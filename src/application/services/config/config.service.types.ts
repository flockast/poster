export type ConfigDatabase = {
  host: string
  port: number
  user: string
  password: string
  database: string
}

export type ConfigToken = {
  secret: string
  expiresIn: string
}

export type ConfigRootAdmin = {
  email: string
  password: string
}
