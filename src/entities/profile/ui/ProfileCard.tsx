import type { Profile } from '../model/types'

interface ProfileCardProps {
  profile: Profile
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <article>
      <h1>Мой профиль</h1>
      <p>ФИО: {profile.fullName ?? 'Добавьте имя и фамилию'}</p>
      <p>Email: {profile.email ?? 'Добавьте email'}</p>
      <p>Аватар: {profile.avatarUrl ?? 'Загрузите аватар'}</p>
    </article>
  )
}

export default ProfileCard
