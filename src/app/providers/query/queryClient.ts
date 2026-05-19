import { QueryClient } from '@tanstack/react-query'

// создаем экземпляр QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      gcTime: 1000 * 60 * 10, // 10 минут
      refetchOnWindowFocus: false, // не перезапрашивать данные при фокусе окна
      refetchOnMount: true, // перезапрашивать данные при монтировании компонента
      refetchOnReconnect: true, // перезапрашивать данные при реконнекте
      retry: 1, // попытаться перезапросить данные 1 раз
    },
  },
})
