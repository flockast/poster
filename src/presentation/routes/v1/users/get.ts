import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/', () => {
    return {
      users: []
    }
  })
}

export default route
