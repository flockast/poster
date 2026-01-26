import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { SchemaPost } from '../../../schemas'
import { decodeSort } from '../../../common/utilities/decode-sort.utilities'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get<{
    Querystring: Static<typeof SchemaPost.RequestQueryList>
  }>('/', {
    schema: {
      tags: ['Posts'],
      querystring: SchemaPost.RequestQueryList,
      response: {
        200: SchemaPost.List
      }
    }
  }, (request) => {
    const { offset, limit, sort } = request.query
    return app.postReadUseCase.findAll(
      {
        offset: offset!,
        limit: limit!
      },
      decodeSort(sort!)
    )
  })

  app.get<{
    Params: Static<typeof SchemaPost.Id>
  }>('/:id', {
    schema: {
      tags: ['Posts'],
      params: SchemaPost.Id,
      response: {
        200: SchemaPost.Item
      }
    }
  }, (request) => {
    return app.postReadUseCase.findById(request.params.id)
  })

  app.get<{
    Params: Static<typeof SchemaPost.Slug>
  }>('/slug/:slug', {
    schema: {
      tags: ['Posts'],
      params: SchemaPost.Slug,
      response: {
        200: SchemaPost.Item
      }
    }
  }, (request) => {
    return app.postReadUseCase.findBySlug(request.params.slug)
  })
}

export default route
