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
        <p>ФИО: Тут должно быть имя и фамилия пользователя</p>
        <p>Email: {user?.email ?? ''}</p>
      </section>
      <SignOut />
    </div>
  )
}

export default ProfilePage
