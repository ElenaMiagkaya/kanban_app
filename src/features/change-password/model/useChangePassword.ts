import { useMutation } from '@tanstack/react-query'
import { updateAuthUser } from '@shared/api'
import { signInWithEmail } from '@shared/api'
import { signOut } from '@shared/api'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/config'

export const useChangePassword = (userEmail: string) => {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async ({
      newPassword,
      currentPassword,
    }: {
      newPassword: string
      currentPassword: string
    }): Promise<void> => {
      await signInWithEmail(userEmail, currentPassword) //проверяем текущий пароль
      await updateAuthUser({ password: newPassword }) //обновляем пароль
    },
    onSuccess: async () => {
      await signOut() //выходим из аккаунта
      navigate(ROUTES.signIn, { replace: true }) //переходим на страницу входа и заменяем страницу в истории браузера,чтобы пользователь не мог вернуться на страницу изменения пароля
    },
  })
  return mutation
}
