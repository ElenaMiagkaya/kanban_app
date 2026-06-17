import { useQuery } from '@tanstack/react-query'
import { getProfile } from './getProfile'
import { useAuth } from '@shared/lib'
import { profileKeys } from './profileKeys'
import type { Profile } from '../model/types'

export const useProfile = () => {
  const auth = useAuth()
  const query = useQuery<Profile, Error>({
    queryKey: profileKeys.detail(auth.user?.id ?? ''), //ключ для запроса, который будет использоваться в queryClient
    queryFn: () => getProfile(auth.user!.id, auth.user!.email), //! - это безопасный доступ к свойству user, так как мы знаем, что user не может быть null
    enabled: !auth.isLoading && auth.isAuth && Boolean(auth.user?.id), //enabled: true - это значит, что запрос будет выполнен, если условие истинно
    // опции для queryClient
    staleTime: 1000 * 60 * 60, // 1 час
    gcTime: 1000 * 60 * 60 * 24, // 24 часа
    refetchOnMount: false, // не перезапрашивать данные при монтировании компонента
    refetchOnReconnect: false, // не перезапрашивать данные при реконнекте
  })

  return {
    ...query,
    user: auth.user,
    isLoading: auth.isLoading,
  }
}
