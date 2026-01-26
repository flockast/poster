import { type Kysely, type SelectExpression, sql } from 'kysely'
import type { DB } from 'kysely-codegen'
import type { Tag, CreateTag, UpdateTag } from '@/application/entities/tag.entity'
import type { TagRepositoryPort } from '@/application/repositories/tag.repository.port'

export class TagRepository implements TagRepositoryPort {
  protected readonly DEFAULT_SELECT_FIELDS = [
    'id',
    'slug',
    'title',
    'created_at as createdAt',
    'updated_at as updatedAt'
  ] satisfies ReadonlyArray<SelectExpression<DB, 'tags'>>

  constructor(protected readonly db: Kysely<DB>) {}

  findAll(): Promise<Tag[]> {
    return this.db
      .selectFrom('tags')
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute()
  }

  findById(id: Tag['id']): Promise<Tag | undefined> {
    return this.db
      .selectFrom('tags')
      .where('id', '=', id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  findBySlug(slug: Tag['slug']): Promise<Tag | undefined> {
    return this.db
      .selectFrom('tags')
      .where('slug', '=', slug)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  create(payload: CreateTag): Promise<Tag> {
    return this.db
      .insertInto('tags')
      .values({
        slug: payload.slug,
        title: payload.title
      })
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow()
  }

  update(id: Tag['id'], payload: UpdateTag): Promise<Tag | undefined> {
    return this.db
      .updateTable('tags')
      .set({
        slug: payload.slug,
        title: payload.title,
        updated_at: sql`CURRENT_TIMESTAMP`
      })
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  delete(id: Tag['id']): Promise<Tag | undefined> {
    return this.db
      .deleteFrom('tags')
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }
}
