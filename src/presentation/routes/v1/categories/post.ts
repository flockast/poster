import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { USER_ROLES } from '@/application/entities/user.entity'
import { SchemaCategory } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.post<{
    Body: Static<typeof SchemaCategory.CreateRequest>
  }>('/', {
    onRequest: [app.authenticate, app.permission([USER_ROLES.ADMIN, USER_ROLES.MODERATOR])],
    schema: {
      tags: ['Categories'],
      body: SchemaCategory.CreateRequest,
      response: {
        200: SchemaCategory.Item
      }
    }
  }, (request) => {
    return app.categoryWriteUseCase.create(request.body)
  })
}

export default route
