import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Auth } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/me', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['Auth'],
      response: {
        200: Auth.Responses.Me
      }
    }
  }, (request) => {
    return app.userReadUseCase.findById(request.user?.id as number)
  })
}

export default route
