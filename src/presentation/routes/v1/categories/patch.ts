import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { USER_ROLES } from '@/application/entities/user.entity'
import { SchemaCategory } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.patch<{
    Params: Static<typeof SchemaCategory.Id>
    Body: Static<typeof SchemaCategory.UpdateRequest>
  }>('/:id', {
    onRequest: [app.authenticate, app.permission([USER_ROLES.ADMIN, USER_ROLES.MODERATOR])],
    schema: {
      tags: ['Users'],
      params: SchemaCategory.Id,
      body: SchemaCategory.UpdateRequest,
      response: {
        200: SchemaCategory.Item
      }
    }
  }, (request) => {
    return app.categoryWriteUseCase.update(request.params.id, request.body)
  })
}

export default route
