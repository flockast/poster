import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { SchemaHealth } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/', {
    schema: {
      tags: ['Health'],
      response: {
        200: SchemaHealth.Response
      }
    }
  }, () => {
    return {
      status: 'OK',
      currentDateTime: (new Date()).toISOString()
    }
  })
}

export default route
