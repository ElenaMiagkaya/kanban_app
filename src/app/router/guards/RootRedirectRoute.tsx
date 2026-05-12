import { useAuth } from '@/shared/lib/auth/session'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/config'

export const RootRedirectRoute = () => {
  const { isAuth, isLoading } = useAuth() //получаем статус авторизации и загрузку из хука, который читает контекст
  if (isLoading) {
    return <div>Loading...</div>
  }
  return isAuth ? <Navigate to={ROUTES.profile} replace /> : <Navigate to={ROUTES.signIn} replace />
}
