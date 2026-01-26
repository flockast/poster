import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { USER_ROLES } from '@/application/entities/user.entity'
import { SchemaTag } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.patch<{
    Params: Static<typeof SchemaTag.Id>
    Body: Static<typeof SchemaTag.UpdateRequest>
  }>('/:id', {
    onRequest: [app.authenticate, app.permission([USER_ROLES.ADMIN, USER_ROLES.MODERATOR])],
    schema: {
      tags: ['Tags'],
      params: SchemaTag.Id,
      body: SchemaTag.UpdateRequest,
      response: {
        200: SchemaTag.Item
      }
    }
  }, (request) => {
    return app.tagWriteUseCase.update(request.params.id, request.body)
  })
}

export default route
