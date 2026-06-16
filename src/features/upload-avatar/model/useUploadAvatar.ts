import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '@entities/profile'
import { useAuth } from '@shared/lib/auth/session'
import { profileKeys } from '@entities/profile'
import { uploadAvatarFile } from '@shared/api/storage'
import type { Profile } from '@entities/profile'

export const useUploadAvatar = () => {
  const queryClient = useQueryClient() //хук, который берет queryClient из контекста выше
  const auth = useAuth() //id и email пользователя
  const mutation = useMutation<Profile, Error, File>({
    //строгая типизация успех = Profile, ошибка = Error, входные данные = File
    mutationKey: ['avatar', 'upload'], //ключ муи
    mutationFn: async (file: File) => {
      //mutationFn может принимать только один аргумент, поэтому мы передаем объект с данными для обновления
      if (!auth.user?.id) throw new Error('Пользователь не найден')
      const url = await uploadAvatarFile(file, auth.user.id) //загружаем файл в storage и получаем url
      const updatedProfile = await updateProfile(auth.user.id, { avatar_url: url }, auth.user.email) //обновляем профиль в БД и получаем обновленный профиль
      return updatedProfile
    },
    onSuccess: (profile) => {
      //onSuccess выполняется после успешной загрузки файла
      queryClient.setQueryData(profileKeys.detail(profile.id), profile) //обновляем профиль в queryClient
    },
  })
  return mutation
}
