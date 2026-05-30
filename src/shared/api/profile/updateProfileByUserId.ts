import { supabase } from '../supabase/client'
import { withRetry } from '@/shared/lib'

interface updateData {
  avatar_url?: string | null
  full_name?: string | null
}

export const updateProfileByUserId = async (
  userId: string,
  updateData: updateData,
): Promise<{ id: string; full_name: string | null; avatar_url: string | null }> => {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select('id,full_name,avatar_url') //выбираем поля из таблицы profiles в БД
      .single()
    if (error) throw error
    return data
  })
}
