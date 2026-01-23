import bcrypt from 'bcrypt'
import type { PasswordServicePort } from '@/application/services/password/password.service.port'

export class PasswordService implements PasswordServicePort {
  private readonly saltRounds = 10

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
