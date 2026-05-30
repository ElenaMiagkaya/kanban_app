import { isNetworkError } from '../network/isNetworkError' //импорт функции для проверки сетевой ошибки(по дефолту)

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)) //создаём Promise, который "просыпается" через указанное количество миллисекунд

type WithRetryOptions = {
  retries?: number // сколько раз повторять (по умолчанию 3)
  delay?: number // задержка между попытками (по умолчанию 1000 мс)
  shouldRetry?: (error: unknown) => boolean // функция для определения, нужно ли повторять попытку (по умолчанию true)
}

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options?: WithRetryOptions,
): Promise<T> => {
  const retries = options?.retries ?? 3
  const delay = options?.delay ?? 1000
  const shouldRetry = options?.shouldRetry ?? isNetworkError // функция для определения, нужно ли повторять попытку

  for (let attempt = 0; attempt < retries; attempt++) {
    //повторяем поптыки до retries-1
    try {
      return await fn()
    } catch (error) {
      //если попытка не удалась, сохраняем ошибку и проверяем, нужно ли повторять попытку
      if (attempt === retries - 1 || !shouldRetry(error)) {
        //если это последняя попытка или не нужно повторять попытку, выбрасываем ошибку
        throw error
      }
      await wait(delay * (attempt + 1)) // задержка между попытками
    }
  }
}
