import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { USER_ROLES } from '@/application/entities/user.entity'
import { SchemaCategory } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.delete<{
    Params: Static<typeof SchemaCategory.Id>
  }>('/:id', {
    onRequest: [app.authenticate, app.permission([USER_ROLES.ADMIN, USER_ROLES.MODERATOR])],
    schema: {
      tags: ['Categories'],
      params: SchemaCategory.Id,
      response: {
        200: SchemaCategory.Item
      }
    }
  }, (request) => {
    return app.categoryWriteUseCase.delete(request.params.id)
  })
}

export default route
