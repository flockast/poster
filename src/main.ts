import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { fastify } from 'fastify'
import autoLoad from '@fastify/autoload'
import qs from 'qs'
import { errorHandler } from './presentation/handlers/error.handler'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = fastify({
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
      censor: '***'
    }
  }
})

const setErrorHandler = () => {
  app.setErrorHandler(errorHandler)
}


const registerPlugins = async () => {
  await app.register(autoLoad, {
    dir: join(__dirname, 'infrastructure/plugins'),
    forceESM: true
  })
}

const registerDecorators = async () => {
  await app.register(autoLoad, {
    dir: join(__dirname, 'infrastructure/decorators'),
    forceESM: true
  })
}

const registerSwagger = async () => {
  await app.register(import('@fastify/swagger'))
  await app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/documentation'
  })
}

const registerRoutes = async () => {
  await app.register(autoLoad, {
    dir: join(__dirname, 'presentation/routes'),
    options: {
      prefix: '/api'
    },
    forceESM: true
  })

  app.ready(() => {
    app.log.info(
      app.printRoutes()
    )
  })
}

const listenServer = async () => {
  try {
    await app.listen({
      port: 3000,
      host: '0.0.0.0'
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

const start = async () => {
  setErrorHandler()
  await registerPlugins()
  await registerDecorators()
  await registerSwagger()
  await registerRoutes()
  await listenServer()
}

await start()
