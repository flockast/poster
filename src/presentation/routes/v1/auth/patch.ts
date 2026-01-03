import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { SchemaUser } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.patch<{
    Body: Static<typeof SchemaUser.UpdateMeRequest>
  }>('/me', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['Auth'],
      body: SchemaUser.UpdateMeRequest,
      response: {
        200: SchemaUser.User
      }
    }
  }, (request) => {
    if (request.user?.id) {
      return app.userWriteUseCase.update(request.user.id, request.body)
    }
  })
}

export default route
