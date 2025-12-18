import { Auth } from '@/presentation/schemas'
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Static } from '@sinclair/typebox'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.post<{
    Body: Static<typeof Auth.Requests.SignUp>
  }>('/registration', {
    schema: {
      body: Auth.Requests.SignUp,
      response: {
        200: Auth.Responses.User
      }
    }
  }, (request) => {
    return app.userRegistrationUseCase.execute(request.body)
  })

  app.post<{
    Body: Static<typeof Auth.Requests.SignIn>
  }>('/login', {
    schema: {
      body: Auth.Requests.SignIn,
      response: {
        200: Auth.Responses.User
      }
    }
  }, (request) => {
    return app.userLoginUseCase.execute(request.body)
  })
}

export default route
