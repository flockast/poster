import { type Kysely, type SelectExpression, sql } from 'kysely'
import type { DB } from 'kysely-codegen'
import type { User, CreateUser, UpdateUser } from '@/domain/entities/user.entity'
import type { UserRepositoryPort } from '@/domain/ports/user.port'

export class UserRepository implements UserRepositoryPort {
  protected readonly DEFAULT_SELECT_FIELDS = [
    'id',
    'email',
    'password_hash as passwordHash',
    'created_at as createdAt',
    'updated_at as updatedAt'
  ] satisfies ReadonlyArray<SelectExpression<DB, 'users'>>

  constructor(protected readonly db: Kysely<DB>) {}

  findAll(): Promise<User[]> {
    return this.db
      .selectFrom('users')
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute()
  }

  findById(id: User['id']): Promise<User | undefined> {
    return this.db
      .selectFrom('users')
      .where('id', '=', id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  findByEmail(email: User['email']): Promise<User | undefined> {
    return this.db
      .selectFrom('users')
      .where('email', '=', email)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  create(payload: CreateUser): Promise<User> {
    return this.db
      .insertInto('users')
      .values({
        email: payload.email,
        password_hash: payload.passwordHash
      })
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow()
  }

  update(id: User['id'], payload: UpdateUser): Promise<User | undefined> {
    return this.db
      .updateTable('users')
      .set({
        email: payload.email,
        password_hash: payload.passwordHash,
        updated_at: sql`CURRENT_TIMESTAMP`
      })
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  delete(id: User['id']): Promise<User | undefined> {
    return this.db
      .deleteFrom('users')
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }
}
