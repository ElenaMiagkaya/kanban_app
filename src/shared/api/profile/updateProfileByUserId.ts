import { supabase } from '../supabase/client'

interface updateData {
  avatar_url?: string | null
  full_name?: string | null
}

export const updateProfileByUserId = async (userId: string, updateData: updateData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select('id,full_name,avatar_url') //выбираем поля из таблицы profiles в БД
    .single()
  if (error) throw error
  return data
}
