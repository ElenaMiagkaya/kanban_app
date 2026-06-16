import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeAvatarFile } from '@shared/api/storage'
import { useAuth } from '@shared/lib/auth/session'
import { profileKeys } from '@entities/profile'
import type { Profile } from '@entities/profile'
import { updateProfile } from '@entities/profile'

export const useRemoveAvatar = () => {
  const queryClient = useQueryClient() //хук, который берет queryClient из контекста выше
  const auth = useAuth() //id и email пользователя
  const mutation = useMutation<Profile, Error, void>({
    //строгая типизация успех = Profile, ошибка = Error, входные данные = void
    mutationKey: ['avatar', 'remove'], //ключ мутации
    mutationFn: async () => {
      if (!auth.user?.id) throw new Error('Пользователь не найден')
      await removeAvatarFile(auth.user.id) //удаляем файл из storage
      const updatedProfile = await updateProfile(
        auth.user.id,
        { avatar_url: null },
        auth.user.email,
      ) //обновляем профиль в БД и получаем обновленный профиль
      return updatedProfile //возвращаем обновленный профиль
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.detail(profile.id), profile) //обновляем профиль в queryClient
    },
  })
  return mutation
}
