import { RouterProvider } from 'react-router-dom'
import { router } from '@app/router/router'

const AppProviders = () => {
  return <RouterProvider router={router} />
}

export default AppProviders
