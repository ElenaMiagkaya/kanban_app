import { RouterProvider } from 'react-router-dom'
import { router } from '@app/router/router'
import { AuthProvider } from './auth/AuthProvider'

const AppProviders = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default AppProviders
