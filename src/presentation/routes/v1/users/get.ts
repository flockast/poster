import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { USER_ROLES } from '@/application/entities/user.entity'
import { SchemaUser } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/', {
    onRequest: [app.authenticate, app.permission([USER_ROLES.ADMIN])],
    schema: {
      tags: ['Users'],
      response: {
        200: SchemaUser.UsersList
      }
    }
  }, () => {
    return app.userReadUseCase.findAll()
  })

  app.get<{
    Params: Static<typeof SchemaUser.UserId>
  }>('/:id', {
    onRequest: [app.authenticate, app.permission([USER_ROLES.ADMIN])],
    schema: {
      tags: ['Users'],
      params: SchemaUser.UserId,
      response: {
        200: SchemaUser.User
      }
    }
  }, (request) => {
    return app.userReadUseCase.findById(request.params.id)
  })

  app.get<{
    Params: Static<typeof SchemaUser.UserEmail>
  }>('/email/:email', {
    onRequest: [app.authenticate],
    schema: {
      tags: ['Users'],
      params: SchemaUser.UserEmail,
      response: {
        200: SchemaUser.User
      }
    }
  }, (request) => {
    return app.userReadUseCase.findByEmail(request.params.email)
  })
}

export default route
