import { useAuth } from '@app/providers/auth/useAuth'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@shared/config'
import { Outlet } from 'react-router-dom'

export const PublicOnlyRoute = () => {
  const { isAuth, isLoading } = useAuth() //получаем статус авторизации и загрузку из хука, который читает контекст
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isAuth) {
    return <Navigate to={ROUTES.profile} replace />
  }
  return <Outlet />
}
