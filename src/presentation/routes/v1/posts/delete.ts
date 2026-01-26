import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { USER_ROLES } from '@/application/entities/user.entity'
import { SchemaPost } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.delete<{
    Params: Static<typeof SchemaPost.Id>
  }>('/:id', {
    onRequest: [app.authenticate, app.permission([USER_ROLES.ADMIN, USER_ROLES.MODERATOR])],
    schema: {
      tags: ['Posts'],
      params: SchemaPost.Id,
      response: {
        200: SchemaPost.Item
      }
    }
  }, (request) => {
    return app.postWriteUseCase.delete(request.params.id)
  })
}

export default route
