import { updateProfileByUserId } from '@shared/api'
import { mapProfileRowToProfile } from '../model/mapProfileRowToProfile'
import type { Profile } from '../model/types'

// только одно поле из объекта updateData может быть не undefined
export type UpdateProfileInput =
  | { avatar_url: string | null; full_name?: never }
  | { full_name: string | null; avatar_url?: never }

export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput,
  email?: string | null,
): Promise<Profile> => {
  const profile = await updateProfileByUserId(userId, input) //вернет объект с данными из БД все поля из таблицы profiles
  return mapProfileRowToProfile(profile, email) //вернет объект с данными из БД в виде Profile
}
