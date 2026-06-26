import { generatePath } from 'react-router-dom'

export const ROUTES = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  profile: '/profile',
  project: '/project/:projectId',
} as const

export const getProjectRoute = (projectId: string) => generatePath(ROUTES.project, { projectId })
