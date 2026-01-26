import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { USER_ROLES } from '@/application/entities/user.entity'
import { SchemaTag } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.post<{
    Body: Static<typeof SchemaTag.CreateRequest>
  }>('/', {
    onRequest: [app.authenticate, app.permission([USER_ROLES.ADMIN, USER_ROLES.MODERATOR])],
    schema: {
      tags: ['Tags'],
      body: SchemaTag.CreateRequest,
      response: {
        200: SchemaTag.Item
      }
    }
  }, (request) => {
    return app.tagWriteUseCase.create(request.body)
  })
}

export default route
