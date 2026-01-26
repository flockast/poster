import { type TSchema, Type } from '@sinclair/typebox'

export const PaginationQueryRequest = Type.Object({
  offset: Type.Number({ default: 0 }),
  limit: Type.Number({ default: 10 })
})

export const PaginationResponse = (itemsSchema: TSchema) => {
  return Type.Object({
    total: Type.Number({ default: 0 }),
    data: Type.Array(itemsSchema)
  })
}
