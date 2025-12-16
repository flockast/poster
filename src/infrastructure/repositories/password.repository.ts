import bcrypt from 'bcrypt'
import { PasswordRepositoryPort } from '@/domain/ports/password.port'

export class PasswordRepository implements PasswordRepositoryPort {
  private readonly saltRounds = 10

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
