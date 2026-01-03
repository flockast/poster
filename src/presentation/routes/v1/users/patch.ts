import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { SchemaUser } from '../../../schemas'
import { USER_ROLES } from '@/domain/entities/user.entity'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.patch<{
    Params: Static<typeof SchemaUser.UserId>
    Body: Static<typeof SchemaUser.UpdateRequest>
  }>('/:id', {
    onRequest: [app.authenticate, app.permission([USER_ROLES.ADMIN])],
    schema: {
      tags: ['Users'],
      params: SchemaUser.UserId,
      body: SchemaUser.UpdateRequest,
      response: {
        200: SchemaUser.User
      }
    }
  }, (request) => {
    return app.userWriteUseCase.update(request.params.id, request.body)
  })
}

export default route
