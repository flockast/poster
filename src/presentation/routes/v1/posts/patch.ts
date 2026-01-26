import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { USER_ROLES } from '@/application/entities/user.entity'
import { SchemaPost } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.patch<{
    Params: Static<typeof SchemaPost.Id>
    Body: Static<typeof SchemaPost.UpdateRequest>
  }>('/:id', {
    onRequest: [app.authenticate, app.permission([USER_ROLES.ADMIN, USER_ROLES.MODERATOR])],
    schema: {
      tags: ['Posts'],
      params: SchemaPost.Id,
      body: SchemaPost.UpdateRequest,
      response: {
        200: SchemaPost.Item
      }
    }
  }, (request) => {
    const { slug, title, content, status, categoryId, tagsIds } = request.body

    return app.postWriteUseCase.update(request.params.id, {
      post: {
        slug,
        title,
        content,
        status
      },
      categoryId,
      tagsIds
    })
  })
}

export default route
