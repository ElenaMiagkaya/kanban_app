import { useProfile, ProfileCard } from '@entities/profile'
import { UploadAvatar } from '@features/upload-avatar'
import { RemoveAvatar } from '@features/remove-avatar'
import { UpdateName } from '@features/update-name'

const ProfileWidget = () => {
  const { user, isLoading, data: profile, isPending, isError } = useProfile()

  if (isLoading) return <div>Загрузка профиля...</div> // если загрузка аутентификации, выводим сообщение
  if (!user) return <div>Пользователь не найден</div> // если пользователь не найден, выводим сообщение
  if (isPending) return <div>Загрузка профиля...</div> // если загрузка профиля, выводим сообщение
  if (isError) return <div>Произошла ошибка при загрузке профиля</div> // если ошибка, выводим сообщение
  if (!profile) return <div>Профиль не найден</div> // если профиль не найден, выводим сообщение

  return (
    <ProfileCard
      profile={profile}
      slots={{
        avatarActions: (
          <>
            <UploadAvatar />
            <RemoveAvatar />
          </>
        ),
        nameSlot: <UpdateName name={profile.fullName ? profile.fullName : ''} />,
        emailActions: null,
        passwordActions: null,
      }}
    />
  )
}

export default ProfileWidget
