import { RouterProvider } from 'react-router-dom'
import { router } from '@app/router/router'
import { AuthProvider } from './auth/AuthProvider'
import { QueryProvider } from './QueryProvider'

const AppProviders = () => {
  return (
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  )
}

export default AppProviders
