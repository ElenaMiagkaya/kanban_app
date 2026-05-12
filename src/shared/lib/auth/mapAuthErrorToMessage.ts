export const mapAuthErrorToMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    // проверяем, есть ли статус в ошибке, код в ошибке и сообщение в ошибке
    const maybeStatus = 'status' in error ? error.status : undefined
    const maybeCode = 'code' in error ? error.code : undefined
    const maybeMessage =
      'message' in error && typeof error.message === 'string'
        ? error.message.toLowerCase()
        : undefined

    switch (true) {
      //ошибки регистрации
      case maybeStatus === 422:
      case maybeCode === 'user_already_exists':
      case maybeMessage?.includes('already exists') || maybeMessage?.includes('already registered'):
        return 'Пользователь с таким email уже зарегистрирован'
      //ошибки входа
      case maybeStatus === 400:
      case maybeCode === 'invalid_credentials':
      case maybeMessage?.includes('invalid credentials') ||
        maybeMessage?.includes('invalid password'):
        return 'Неверный email или пароль'
      //ошибки выхода
      case maybeStatus === 401:
      case maybeCode === 'invalid_token':
      case maybeMessage?.includes('invalid token'):
        return 'Не удалось выйти. Обновите страницу и попробуйте снова'
      //ошибки другие
      default:
        return 'Не удалось выполнить операцию. Попробуйте еще раз'
    }
  }
  return 'Не удалось выполнить операцию. Попробуйте еще раз'
}
