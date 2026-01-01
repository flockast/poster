import { AppError } from '@/application/exceptions'
import { type FastifyInstance } from 'fastify'

export const errorHandler: FastifyInstance['errorHandler'] = (error, request, reply) => {
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString()
      }
    })
  } else {
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
    reply.status(500).send({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Внутренняя ошибка сервера',
        timestamp: new Date().toISOString()
      }
    })
  }
}
