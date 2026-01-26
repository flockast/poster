import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { SchemaTag } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/', {
    schema: {
      tags: ['Tags'],
      response: {
        200: SchemaTag.List
      }
    }
  }, () => {
    return app.tagReadUseCase.findAll()
  })

  app.get<{
    Params: Static<typeof SchemaTag.Id>
  }>('/:id', {
    schema: {
      tags: ['Tags'],
      params: SchemaTag.Id,
      response: {
        200: SchemaTag.Item
      }
    }
  }, (request) => {
    return app.tagReadUseCase.findById(request.params.id)
  })

  app.get<{
    Params: Static<typeof SchemaTag.Slug>
  }>('/slug/:slug', {
    schema: {
      tags: ['Tags'],
      params: SchemaTag.Slug,
      response: {
        200: SchemaTag.Item
      }
    }
  }, (request) => {
    return app.tagReadUseCase.findBySlug(request.params.slug)
  })
}

export default route
