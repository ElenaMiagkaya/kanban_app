import { useState, useEffect } from 'react'
import { ProfileCard } from '@entities/profile'
import type { Profile } from '@entities/profile'
import { useAuth } from '@shared/lib/auth/session'
import { getProfileByUserId } from '@shared/api'

const ProfileWidget = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setError(null)
      setProfileLoading(true)
      const profile = await getProfileByUserId(user?.id)
      const newProfile: Profile = {
        id: profile.id,
        fullName: profile.full_name,
        email: user.email,
        avatarUrl: profile.avatar_url,
      }
      setProfile(newProfile)
    } catch (error) {
      setError('Произошла ошибка при загрузке профиля')
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setError('Пользователь не найден')
      setProfileLoading(false)
    }
  }, [user?.id])

  if (profileLoading) return <div>Загрузка профиля...</div>
  if (error) return <div>{error}</div>
  if (!profile) return <div>Профиль не найден</div>

  return <ProfileCard profile={profile} />
}

export default ProfileWidget
