import { getProfileByUserId } from '@shared/api'
import { mapProfileRowToProfile } from '../model/mapProfileRowToProfile'
import type { Profile } from '../model/types'

export const getProfile = async (userId: string, email?: string | null): Promise<Profile> => {
  const profile = await getProfileByUserId(userId)
  return mapProfileRowToProfile(profile, email)
}
