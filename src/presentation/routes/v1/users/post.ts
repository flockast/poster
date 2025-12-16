// import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
// import type { Static } from '@sinclair/typebox'
// import { Users } from '../../../schemas'

// const route: FastifyPluginAsyncTypebox = async (app) => {
//   app.post<{
//     Body: Static<typeof Users.Requests.CreateUser>
//   }>('/', {
//     onRequest: [app.authenticate],
//     schema: {
//       tags: ['Users'],
//       body: Users.Requests.CreateUser,
//       response: {
//         200: Users.Responses.User
//       }
//     }
//   }, (request) => {
//     return app.userUseCase.create(request.body)
//   })
// }

// export default route
