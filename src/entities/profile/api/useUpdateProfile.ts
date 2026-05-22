import { useMutation } from '@tanstack/react-query'
import { updateProfile } from './updateProfile'
import { profileKeys } from './profileKeys'
import { useAuth } from '@shared/lib/auth/session'
import { useQueryClient } from '@tanstack/react-query'
import type { UpdateProfileInput } from './updateProfile'
import type { Profile } from '../model/types'

export const useUpdateProfile = () => {
  const queryClient = useQueryClient() //хук, который берет queryClient из контекста выше

  const auth = useAuth()
  //строгая типизация успех = Profile, ошибка = Error, входные данные = UpdateProfileInput
  const mutation = useMutation<Profile, Error, UpdateProfileInput>({
    //mutationFn может принимать только один аргумент, поэтому мы передаем объект с данными для обновления
    mutationFn: (input: UpdateProfileInput) =>
      updateProfile(auth.user!.id, input, auth.user!.email),
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.detail(data.id), data)
    },
  })
  return {
    ...mutation,
    user: auth.user,
    isLoading: auth.isLoading,
  }
}
