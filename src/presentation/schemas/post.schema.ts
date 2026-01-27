import { Type } from '@sinclair/typebox'
import { SchemaCategory, SchemaTag, SchemaUser } from '.'
import { PaginationResponse, PaginationQueryRequest } from './common.schema'
import { POST_STATUSES } from '@/application/entities/post.entity'

export const Id = Type.Object({
  id: Type.Number()
})

export const Slug = Type.Object({
  slug: Type.String()
})

export const Status = Type.Object({
  status: Type.Union([
    Type.Literal(POST_STATUSES.DRAFT),
    Type.Literal(POST_STATUSES.PUBLISHED),
    Type.Literal(POST_STATUSES.ARCHIVED)
  ])
})

export const Item = Type.Composite([
  Id,
  Slug,
  Status,
  Type.Object({
    title: Type.String(),
    content: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    user: SchemaUser.User,
    category: Type.Union([SchemaCategory.Item, Type.Null()]),
    tags: SchemaTag.List
  })
])

export const RequestQueryList = Type.Partial(
  Type.Intersect([
    PaginationQueryRequest,
    Type.Object({
      sort: Type.Array(
        Type.Union([
          Type.TemplateLiteral('${id|title|content|createdAt|updatedAt}'),
          Type.TemplateLiteral('${id|title|content|createdAt|updatedAt}.${asc|desc}')
        ]), { default: ['id.asc'] })
    })
  ])
)

export const List = PaginationResponse(Item)

export const CreateRequest = Type.Composite([
  Slug,
  Status,
  Type.Object({
    title: Type.String(),
    content: Type.String(),
    categoryId: Type.Optional(Type.Number()),
    tagsIds: Type.Optional(Type.Array(Type.Number()))
  })
])

export const UpdateRequest = Type.Partial(CreateRequest)
