import { updateProfile } from '@entities/profile'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@shared/lib/auth/session'
import type { Profile } from '@entities/profile'
import { profileKeys } from '@entities/profile'
import type { NameSchema } from './validation'

export const useUpdateName = () => {
  const auth = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation<Profile, Error, NameSchema>({
    mutationKey: ['profile', 'name'],
    mutationFn: async (newName: NameSchema) => {
      if (!auth.user?.id) throw new Error('Пользователь не найден')
      const updatedProfile = await updateProfile(
        auth.user.id,
        { full_name: newName },
        auth.user.email,
      ) //обновляем профиль в БД и получаем обновленный профиль
      return updatedProfile //возвращаем обновленный профиль
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.detail(profile.id), profile) //обновляем профиль в queryClient
    },
  })
  return mutation //возвращаем мутацию
}
