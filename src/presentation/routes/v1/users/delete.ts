import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Static } from '@sinclair/typebox'
import { Users } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.delete<{
    Params: Static<typeof Users.Requests.UserId>
  }>('/:userId', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['Users'],
      params: Users.Requests.UserId,
      response: {
        200: Users.Responses.User
      }
    }
  }, (request) => {
    return app.userWriteUseCase.delete(request.params.userId)
  })
}

export default route
