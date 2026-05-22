import type { ReactNode } from 'react'
import { Sidebar } from '@widgets/sidebar'

type AppLayoutProps = {
  children: ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>я хэдер</h1>
        <Sidebar />
      </div>
      {children}
    </div>
  )
}

export default AppLayout
