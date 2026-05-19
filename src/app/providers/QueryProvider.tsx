// компонент для провайдера QueryClient
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './query/queryClient'

// компонент для провайдера QueryClient
export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children} {/* передаем children компоненты */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}{' '}
      {/* показываем DevTools только в режиме разработки */}
    </QueryClientProvider>
  )
}
