import { mockUser } from '@entities/user'

const ProfilePage = () => {
  return (
    <section>
      <h1>Мой профиль</h1>
      <p>ФИО: {mockUser.fullName}</p>
      <p>Email: {mockUser.email}</p>
    </section>
  )
}

export default ProfilePage
