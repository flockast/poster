import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { USER_ROLES } from '@/domain/entities/user.entity'
import { SchemaUser } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.post<{
    Body: Static<typeof SchemaUser.CreateRequest>
  }>('/', {
    onRequest: [app.authenticate, app.permission([USER_ROLES.ADMIN])],
    schema: {
      tags: ['Users'],
      body: SchemaUser.CreateRequest,
      response: {
        200: SchemaUser.User
      }
    }
  }, (request) => {
    return app.userWriteUseCase.create(request.body)
  })
}

export default route
