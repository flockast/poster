import { Type } from '@sinclair/typebox'

export const Id = Type.Object({
  id: Type.Number()
})

export const Slug = Type.Object({
  slug: Type.String()
})

export const Item = Type.Object({
  id: Type.Number(),
  slug: Type.String(),
  title: Type.String(),
  description: Type.Union([Type.String(), Type.Null()])
})

export const List = Type.Array(Item)

export const CreateRequest = Type.Object({
  slug: Type.String(),
  title: Type.String(),
  description: Type.Optional(Type.String())
})

export const UpdateRequest = Type.Partial(CreateRequest)
