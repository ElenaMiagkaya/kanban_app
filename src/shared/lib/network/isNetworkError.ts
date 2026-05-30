// функция для проверки, является ли ошибка сетевой ошибкой
import { AuthUnknownError, isAuthRetryableFetchError } from '@supabase/auth-js'

const NETWORK_MESSAGE_MARKERS = [
  'failed to fetch',
  'network error',
  'network request failed',
  'connection error',
  'load failed',
  'fetch failed',
  'err_connection_reset',
  'err_network_changed',
  'econnreset',
  'etimedout',
] as const

const hasNetworkLikeMessage = (message: string): boolean => {
  const normalized = message.toLowerCase()
  return NETWORK_MESSAGE_MARKERS.some((marker) => normalized.includes(marker))
}

export const isNetworkError = (error: unknown): boolean => {
  if (isAuthRetryableFetchError(error)) {
    return true
  }

  if (error instanceof AuthUnknownError) {
    return isNetworkError(error.originalError)
  }

  if (error instanceof TypeError) {
    return hasNetworkLikeMessage(error.message)
  }

  if (error instanceof Error) {
    return hasNetworkLikeMessage(error.message)
  }

  if (
    typeof DOMException !== 'undefined' &&
    error instanceof DOMException &&
    (error.name === 'NetworkError' || hasNetworkLikeMessage(error.message))
  ) {
    return true
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = error.message
    if (typeof message === 'string' && hasNetworkLikeMessage(message)) {
      return true
    }
  }

  return false
}
