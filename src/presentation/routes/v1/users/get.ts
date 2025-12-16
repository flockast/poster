import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Static } from '@sinclair/typebox'
import { Users } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['Users'],
      response: {
        200: Users.Responses.Users
      }
    }
  }, () => {
    return app.userUseCase.findAll()
  })

  app.get<{
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
    return app.userUseCase.findById(request.params.userId)
  })

  app.get<{
    Params: Static<typeof Users.Requests.UserEmail>
  }>('/email/:email', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['Users'],
      params: Users.Requests.UserEmail,
      response: {
        200: Users.Responses.User
      }
    }
  }, (request) => {
    return app.userUseCase.findByEmail(request.params.email)
  })
}

export default route
