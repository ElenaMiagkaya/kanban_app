import { Outlet } from 'react-router-dom'
import { AppLayout } from '@widgets/app-layout'

const AppLayoutRoute = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default AppLayoutRoute
