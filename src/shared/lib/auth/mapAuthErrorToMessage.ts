export const mapAuthErrorToMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    const maybeStatus = 'status' in error ? error.status : undefined
    const maybeCode = 'code' in error ? error.code : undefined
    const maybeMessage =
      'message' in error && typeof error.message === 'string'
        ? error.message.toLowerCase()
        : undefined

    switch (true) {
      case maybeStatus === 422:
      case maybeCode === 'user_already_exists':
      case maybeMessage?.includes('already exists') || maybeMessage?.includes('already registered'):
        return 'Пользователь с таким email уже зарегистрирован'
      case maybeStatus === 400:
      case maybeCode === 'invalid_credentials':
      case maybeMessage?.includes('invalid credentials') ||
        maybeMessage?.includes('invalid password'):
        return 'Неверный email или пароль'
      default:
        return 'Не удалось выполнить операцию. Попробуйте еще раз'
    }
  }
  return 'Не удалось выполнить операцию. Попробуйте еще раз'
}
