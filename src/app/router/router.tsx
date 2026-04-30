import { createBrowserRouter } from 'react-router-dom'
import { SignInPage } from '@pages/sign-in'
import { SignUpPage } from '@pages/sign-up'
import { ProfilePage } from '@pages/profile'
import { ProjectPage } from '@pages/project'
import { ROUTES } from '@shared/config'
import AppLayoutRoute from './AppLayoutRoute'
import { ErrorPage } from '@pages/error'

export const router = createBrowserRouter([
  {
    path: ROUTES.signIn,
    element: <SignInPage />,
  },
  {
    path: ROUTES.signUp,
    element: <SignUpPage />,
  },
  {
    element: <AppLayoutRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTES.profile,
        element: <ProfilePage />,
      },
      {
        path: ROUTES.project,
        element: <ProjectPage />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
])
