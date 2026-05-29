import { UserAvatar } from '@shared/ui'
import { useProfile } from '@entities/profile'

const Sidebar = () => {
  const { data: profile } = useProfile()
  return (
    <div>
      <h1 style={{ fontSize: '20px' }}>я сайдбар</h1>
      <UserAvatar size={50} src={profile?.avatarUrl} name={profile?.fullName} />
    </div>
  )
}

export default Sidebar
