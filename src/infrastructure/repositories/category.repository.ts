import { type Kysely, type SelectExpression, sql } from 'kysely'
import type { DB } from 'kysely-codegen'
import type { Category, CreateCategory, UpdateCategory } from '@/application/entities/category.entity'
import type { CategoryRepositoryPort } from '@/application/repositories/category.repository.port'

export class CategoryRepository implements CategoryRepositoryPort {
  protected readonly DEFAULT_SELECT_FIELDS = [
    'id',
    'slug',
    'title',
    'description',
    'created_at as createdAt',
    'updated_at as updatedAt'
  ] satisfies ReadonlyArray<SelectExpression<DB, 'categories'>>

  constructor(protected readonly db: Kysely<DB>) {}

  findAll(): Promise<Category[]> {
    return this.db
      .selectFrom('categories')
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute()
  }

  findById(id: Category['id']): Promise<Category | undefined> {
    return this.db
      .selectFrom('categories')
      .where('id', '=', id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  findBySlug(slug: Category['slug']): Promise<Category | undefined> {
    return this.db
      .selectFrom('categories')
      .where('slug', '=', slug)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  create(payload: CreateCategory): Promise<Category> {
    return this.db
      .insertInto('categories')
      .values({
        slug: payload.slug,
        title: payload.title,
        description: payload.description
      })
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow()
  }

  update(id: Category['id'], payload: UpdateCategory): Promise<Category | undefined> {
    return this.db
      .updateTable('categories')
      .set({
        slug: payload.slug,
        title: payload.title,
        description: payload.description,
        updated_at: sql`CURRENT_TIMESTAMP`
      })
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }

  delete(id: Category['id']): Promise<Category | undefined> {
    return this.db
      .deleteFrom('categories')
      .where('id', '=', id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst()
  }
}
