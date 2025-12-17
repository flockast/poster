export abstract class AppError extends Error {
  abstract readonly code: string
  abstract readonly statusCode: number

  constructor(message: string, public readonly details?: any) {
    super(message)
  }
}

export class AppErrorNotFound extends AppError {
  readonly code = 'NOT_FOUND'
  readonly statusCode = 404
}

export class AppErrorUnauthorized extends AppError {
  readonly code = 'UNAUTHORIZED'
  readonly statusCode = 401
}

export class AppErrorAlreadyExisting extends AppError {
  readonly code = 'CONFLICT'
  readonly statusCode = 409

  constructor(message: string) {
    super(message)
  }
}

export class AppErrorInvalidLogin extends AppError {
  readonly code = 'INVALID_CREDENTIALS'
  readonly statusCode = 401

  constructor(message = 'Неверные логин или пароль') {
    super(message)
  }
}
