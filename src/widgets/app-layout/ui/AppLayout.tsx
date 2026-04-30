import type { ReactNode } from 'react'

type AppLayoutProps = {
  children: ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div>
      <h1>я хэдер</h1>
      {children}
    </div>
  )
}

export default AppLayout
