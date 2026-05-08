import { Outlet } from 'react-router-dom'
import { AppLayout } from '@widgets/app-layout'

export const AppLayoutRoute = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
