import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { SchemaUser } from '@/presentation/schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.post<{
    Body: Static<typeof SchemaUser.RegistrationRequest>
  }>('/registration', {
    schema: {
      tags: ['Auth'],
      body: SchemaUser.RegistrationRequest,
      response: {
        200: SchemaUser.RegistrationResponse
      }
    }
  }, (request) => {
    return app.userRegistrationUseCase.execute(request.body)
  })

  app.post<{
    Body: Static<typeof SchemaUser.LoginRequest>
  }>('/login', {
    schema: {
      tags: ['Auth'],
      body: SchemaUser.LoginRequest,
      response: {
        200: SchemaUser.LoginResponse
      }
    }
  }, (request) => {
     return app.userLoginUseCase.execute(request.body)
  })
}

export default route
