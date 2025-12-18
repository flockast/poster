import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { Users } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.patch<{
    Params: Static<typeof Users.Requests.UserId>
    Body: Static<typeof Users.Requests.UpdateUser>
  }>('/:userId', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['Users'],
      params: Users.Requests.UserId,
      body: Users.Requests.UpdateUser,
      response: {
        200: Users.Responses.User
      }
    }
  }, (request) => {
    return app.userWriteUseCase.update(request.params.userId, request.body)
  })
}

export default route
