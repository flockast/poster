import { type FastifyInstance } from 'fastify'
import { ExceptionNotFound, ExceptionAlreadyExisting, ExceptionUnauthorized, ExceptionInvalidLogin } from '@/application/commons/exceptions'

export const errorHandler: FastifyInstance['errorHandler'] = (error, request, reply) => {
  if (error instanceof ExceptionNotFound) {
    return reply.notFound(error.message)
  }

  if (error instanceof ExceptionAlreadyExisting) {
    return reply.unprocessableEntity(error.message)
  }

  if (error instanceof ExceptionUnauthorized) {
    return reply.unauthorized(error.message)
  }

  if (error instanceof ExceptionInvalidLogin) {
    return reply.unauthorized(error.message)
  }

  reply.log.error({
    request: {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
      query: request.query,
      params: request.params
    },
    error
  })

  reply.send(error)
}
