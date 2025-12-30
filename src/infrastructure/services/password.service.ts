import bcrypt from 'bcrypt'
import { PasswordPort } from '@/application/features/password/password.port'

export class PasswordService implements PasswordPort {
  private readonly saltRounds = 10

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
