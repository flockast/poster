import { type  Kysely, sql, type SelectExpression } from 'kysely'
import type { DB } from 'kysely-codegen'
import type { CreatePostPayload, PostRepositoryPort, PostWithRelations, UpdatePostPayload } from '@/application/repositories/post.repository.port'
import type { PaginationRequest, PaginationResponse, SortByRequest } from '@/application/common/type'
import type { Post } from '@/application/entities/post.entity'
import type { User } from '@/application/entities/user.entity'
import type { Category } from '@/application/entities/category.entity'
import type { Tag } from '@/application/entities/tag.entity'
import { buildSortBy } from '../common/utilities/build-sort-by.utilities'

export class PostRepository implements PostRepositoryPort {
  protected readonly POST_FIELDS = [
    'posts.id as id',
    'posts.slug as slug',
    'posts.title as title',
    'posts.content as content',
    'posts.status as status',
    'posts.created_at as createdAt',
    'posts.updated_at as updatedAt'
  ] satisfies ReadonlyArray<SelectExpression<DB, 'posts'>>

  protected readonly USER_AGGREGATION = sql<User>`
    CASE
      WHEN users.id IS NOT NULL THEN
        json_build_object(
          'id', ${sql.ref('users.id')},
          'email', ${sql.ref('users.email')},
          'role', ${sql.ref('users.role')},
          'createdAt', ${sql.ref('users.created_at')},
          'updatedAt', ${sql.ref('users.updated_at')}
        )
      ELSE NULL
    END
  `.as('user')

  protected readonly CATEGORY_AGGREGATION = sql<Category>`
    CASE
      WHEN categories.id IS NOT NULL THEN
        json_build_object(
          'id', ${sql.ref('categories.id')},
          'slug', ${sql.ref('categories.slug')},
          'title', ${sql.ref('categories.title')},
          'description', ${sql.ref('categories.description')},
          'createdAt', ${sql.ref('categories.created_at')},
          'updatedAt', ${sql.ref('categories.updated_at')}
        )
      ELSE NULL
    END
  `.as('category')

  protected readonly TAGS_AGGREGATION = sql<Tag[]>`
    json_agg(
      json_build_object(
        'id', ${sql.ref('tags.id')},
        'slug', ${sql.ref('tags.slug')},
        'title', ${sql.ref('tags.title')}
      )
    ) FILTER (WHERE tags.id IS NOT NULL)
  `.as('tags')

  constructor(protected readonly db: Kysely<DB>) {}

  private buildPostQuery(trx?: Kysely<DB>) {
    const queryBuilder = trx || this.db

    return queryBuilder
      .selectFrom('posts')
      .leftJoin('users', 'users.id', 'posts.user_id')
      .leftJoin('categories', 'categories.id', 'posts.category_id')
      .leftJoin('posts_tags', 'posts_tags.post_id', 'posts.id')
      .leftJoin('tags', 'tags.id', 'posts_tags.tag_id')
      .select([
        ...this.POST_FIELDS,
        this.USER_AGGREGATION,
        this.CATEGORY_AGGREGATION,
        this.TAGS_AGGREGATION
      ])
      .groupBy(['posts.id', 'categories.id'])
  }

  async findAll(pagination: PaginationRequest, sortBy: SortByRequest<Post>): Promise<PaginationResponse<PostWithRelations>> {
    const countQuery = this.db
      .selectFrom('posts')
      .select(({ fn }) => (
        [fn.count<number>('posts.id').as('count')]
      ))
      .executeTakeFirst()

    const listQuery = this.buildPostQuery()
      .orderBy(buildSortBy<'posts', Post>(sortBy, 'posts'))
      .orderBy('created_at', 'asc')
      .offset(pagination.offset)
      .limit(pagination.limit)
      .execute()

    const [countResult, listResult] = await Promise.all([countQuery, listQuery])

    return {
      total: countResult?.count ?? 0,
      data: listResult
    }
  }

  findById(id: Post['id']): Promise<PostWithRelations | undefined> {
    return this.buildPostQuery()
      .where('posts.id', '=', id)
      .executeTakeFirst()
  }

  findBySlug(slug: Post['slug']): Promise<PostWithRelations | undefined> {
    return this.buildPostQuery()
      .where('posts.slug', '=', slug)
      .executeTakeFirst()
  }

  create(payload: CreatePostPayload): Promise<PostWithRelations> {
    return this.db.transaction().execute(async (trx) => {
      const createdItem = await trx
        .insertInto('posts')
        .values({
          title: payload.post.title,
          slug: payload.post.slug,
          content: payload.post.content,
          user_id: payload.userId,
          category_id: payload.categoryId
        })
        .returning(this.POST_FIELDS)
        .executeTakeFirstOrThrow()

      if (payload.tagsIds && payload.tagsIds.length) {
        await trx
          .insertInto('posts_tags')
          .values(
            payload.tagsIds.map((tagId) => ({
              post_id: createdItem.id,
              tag_id: tagId
            }))
          )
          .execute()
      }

      return this.buildPostQuery(trx)
        .where('posts.id', '=', createdItem.id)
        .executeTakeFirstOrThrow()
    })
  }

  update(id: Post['id'], payload: UpdatePostPayload): Promise<PostWithRelations | undefined> {
    return this.db.transaction().execute(async (trx) => {
      const updatedItem = await trx
        .updateTable('posts')
        .set({
          title: payload.post.title,
          slug: payload.post.slug,
          content: payload.post.content,
          category_id: payload.categoryId,
          updated_at: sql`CURRENT_TIMESTAMP`
        })
        .where('id', '=', id)
        .returning(this.POST_FIELDS)
        .executeTakeFirst()

      if (!updatedItem) {
        return undefined
      }

      if (payload.tagsIds !== undefined) {
        await trx
          .deleteFrom('posts_tags')
          .where('post_id', '=', id)
          .execute()
      }

      if (payload.tagsIds && payload.tagsIds.length) {
        await trx
          .insertInto('posts_tags')
          .values(payload.tagsIds.map((tagId) => ({
            post_id: id,
            tag_id: tagId
          })))
          .execute()
      }

      return this.buildPostQuery(trx)
        .where('posts.id', '=', id)
        .executeTakeFirstOrThrow()
    })
  }

  delete(id: Post['id']): Promise<PostWithRelations | undefined> {
    return this.db.transaction().execute(async (trx) => {
      const item = await this.buildPostQuery(trx)
        .where('posts.id', '=', id)
        .executeTakeFirst()

      if (!item) {
        return undefined
      }

      await trx
        .deleteFrom('posts')
        .where('id', '=', id)
        .execute()

      return item
    })
  }
}
