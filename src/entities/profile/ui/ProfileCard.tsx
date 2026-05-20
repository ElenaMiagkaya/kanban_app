import type { ReactNode } from 'react'
import type { Profile } from '../model/types'
import { UserAvatar } from '@shared/ui'

// именованные слоты для ProfileCard
interface ProfileCardSlots {
  avatarActions: ReactNode
  nameSlot: ReactNode
  emailActions: ReactNode
  passwordActions: ReactNode
}

interface ProfileCardProps {
  profile: Profile
  slots: ProfileCardSlots
}

const ProfileCard = ({ profile, slots }: ProfileCardProps) => {
  return (
    <article style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h1>Профиль</h1>
      <UserAvatar src={profile.avatarUrl} name={profile.fullName} size={100} />
      <div style={{ display: 'flex', gap: '10px' }}>
        <p>Email: {profile.email || 'Добавьте email'}</p>
      </div>
    </article>
  )
}

export default ProfileCard
