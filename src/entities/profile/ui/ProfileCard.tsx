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
    <article style={{ display: 'flex', flexDirection: 'column', gap: '10px',textAlign: 'left'}}>
      <h1>Профиль</h1>
      <div style={{ display: 'flex', gap: '10px' }}>
        <UserAvatar src={profile.avatarUrl} name={profile.fullName} size={100} />
        {slots.avatarActions}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>{slots.nameSlot}</div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <p>{profile.email} </p>
        {slots.emailActions}
      </div>
      {slots.passwordActions}
    </article>
  )
}

export default ProfileCard
