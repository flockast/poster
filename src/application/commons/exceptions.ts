export class ExceptionNotFound extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, ExceptionNotFound.prototype)
  }
}

export class ExceptionAlreadyExisting extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, ExceptionAlreadyExisting.prototype)
  }
}

export class ExceptionUnauthorized extends Error {
  constructor(message = 'Пользователь не авторизован') {
    super(message)
    Object.setPrototypeOf(this, ExceptionUnauthorized.prototype)
  }
}

export class ExceptionInvalidLogin extends Error {
  constructor(message = 'Неверные логин или пароль') {
    super(message)
    Object.setPrototypeOf(this, ExceptionInvalidLogin.prototype)
  }
}
