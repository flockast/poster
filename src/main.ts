import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { fastify } from 'fastify'
import autoLoad from '@fastify/autoload'
import qs from 'qs'
import { errorHandler } from './presentation/handlers/error.handler'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class Server {
  private static app = fastify({
    routerOptions: {
      querystringParser: (str) => qs.parse(str)
    },
    logger: {
      transport: {
        target: 'pino-pretty'
      },
      redact: {
        paths: [
          '[*].password',
          '[*].user'
        ],
        censor: "***"
      }
    },
  })

  private static async setErrorHandler() {
    Server.app.setErrorHandler(errorHandler)
  }

  private static async registerPlugins() {
    await Server.app.register(autoLoad, {
      dir: join(__dirname, 'infrastructure/plugins'),
      forceESM: true
    })
  }

  private static async registerDecorators() {
    await Server.app.register(autoLoad, {
      dir: join(__dirname, 'infrastructure/decorators'),
      forceESM: true
    })
  }

  private static async registerSwagger() {
    await Server.app.register(import('@fastify/swagger'))
    await Server.app.register(import('@fastify/swagger-ui'), {
      routePrefix: '/documentation'
    })
  }

  private static async registerRoutes() {
    await Server.app.register(autoLoad, {
      dir: join(__dirname, 'presentation/routes'),
      options: {
        prefix: '/api'
      },
      forceESM: true
    })

    Server.app.ready(() => {
      Server.app.log.info(
        Server.app.printRoutes()
      )
    })
  }

  private static async listenServer() {
    try {
      await Server.app.listen({
        port: 3000,
        host: '0.0.0.0'
      })
    } catch (err) {
      Server.app.log.error(err)
      process.exit(1)
    }
  }

  public static async start() {
    await Server.setErrorHandler()
    await Server.registerPlugins()
    await Server.registerDecorators()
    await Server.registerSwagger()
    await Server.registerRoutes()
    await Server.listenServer()
  }
}

await Server.start()
