import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { USER_ROLES } from '@/application/entities/user.entity'
import { SchemaPost } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.post<{
    Body: Static<typeof SchemaPost.CreateRequest>
  }>('/', {
    onRequest: [app.authenticate, app.permission([USER_ROLES.ADMIN, USER_ROLES.MODERATOR])],
    schema: {
      tags: ['Posts'],
      body: SchemaPost.CreateRequest,
      response: {
        200: SchemaPost.Item
      }
    }
  }, (request) => {
    if (!request.user?.id) {
      return
    }

    const userId = request.user.id
    const { slug, title, content, status, categoryId, tagsIds } = request.body

    return app.postWriteUseCase.create({
      post: {
        slug,
        title,
        content,
        status
      },
      userId,
      categoryId,
      tagsIds
    })
  })
}

export default route
