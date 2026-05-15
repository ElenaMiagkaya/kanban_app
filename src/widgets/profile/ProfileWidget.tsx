import { useState, useEffect } from 'react'
import { type Profile, ProfileCard, getProfile } from '@entities/profile'
import { useAuth } from '@shared/lib/auth/session'

const ProfileWidget = () => {
  const { user, isLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setError(null)
      setProfileLoading(true)
      const profile = await getProfile(user.id, user.email)
      setProfile(profile)
    } catch (error) {
      setError('Произошла ошибка при загрузке профиля')
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoading && user) {
      fetchProfile()
    }
    if (!isLoading && !user) {
      setError('Пользователь не найден')
      setProfileLoading(false)
    }
  }, [user?.id, isLoading])

  if (profileLoading || isLoading) return <div>Загрузка профиля...</div>
  if (error) return <div>{error}</div>
  if (!profile) return <div>Профиль не найден</div>

  return <ProfileCard profile={profile} />
}

export default ProfileWidget
