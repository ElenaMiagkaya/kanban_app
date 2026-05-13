import { useAuth } from '@/shared/lib/auth/session'
import { SignOut } from '@features/sign-out'

const ProfilePage = () => {
  const { isLoading, user } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <section>
        <h1>Мой профиль</h1>
        <p>ФИО: {user?.fullName ?? 'Добавьте имя и фамилию'}</p>
        <p>Email: {user?.email ?? 'Добавьте email'}</p>
        <p>Аватар: {user?.avatarUrl ?? 'Загрузите аватар'}</p>
      </section>
      <SignOut />
    </div>
  )
}

export default ProfilePage
