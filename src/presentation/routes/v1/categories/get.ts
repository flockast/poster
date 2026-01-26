import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { SchemaCategory } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/', {
    schema: {
      tags: ['Categories'],
      response: {
        200: SchemaCategory.List
      }
    }
  }, () => {
    return app.categoryReadUseCase.findAll()
  })

  app.get<{
    Params: Static<typeof SchemaCategory.Id>
  }>('/:id', {
    schema: {
      tags: ['Categories'],
      params: SchemaCategory.Id,
      response: {
        200: SchemaCategory.Item
      }
    }
  }, (request) => {
    return app.categoryReadUseCase.findById(request.params.id)
  })

  app.get<{
    Params: Static<typeof SchemaCategory.Slug>
  }>('/slug/:slug', {
    schema: {
      tags: ['Categories'],
      params: SchemaCategory.Slug,
      response: {
        200: SchemaCategory.Item
      }
    }
  }, (request) => {
    return app.categoryReadUseCase.findBySlug(request.params.slug)
  })
}

export default route
