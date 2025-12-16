import { Auth } from '@/presentation/schemas'
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Static } from '@sinclair/typebox'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.post<{
    Body: Static<typeof Auth.Requests.SignUp>
  }>('/signup', {
    schema: {
      body: Auth.Requests.SignUp,
      response: {
        200: Auth.Responses.User
      }
    }
  }, (request) => {
    return app.authUseCase.signUp(request.body)
  })

  app.post<{
    Body: Static<typeof Auth.Requests.SignUp>
  }>('/signin', {
    schema: {
      body: Auth.Requests.SignIn,
      response: {
        200: Auth.Responses.User
      }
    }
  }, (request) => {
    return app.authUseCase.signIn(request.body)
  })
}

export default route
