import type { Database } from '@/types/database.types'
import type { Profile } from './types'

type ProfileRow = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'id' | 'full_name' | 'avatar_url'
> //получаем тип строки из таблицы profiles, выбирая только нужные поля

export const mapProfileRowToProfile = (profileRow: ProfileRow, email?: string | null): Profile => {
  return {
    id: profileRow.id,
    fullName: profileRow.full_name,
    email: email ?? '',
    avatarUrl: profileRow.avatar_url,
  }
}
