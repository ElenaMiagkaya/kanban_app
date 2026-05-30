import { supabase } from '../supabase/client'
import { withRetry } from '@/shared/lib'

export const getProfileByUserId = async (
  userId: string,
): Promise<{ id: string; full_name: string | null; avatar_url: string | null }> => {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('profiles') //таблица профилей
      .select('id,full_name,avatar_url') //выбираем поля из таблицы profiles в БД
      .eq('id', userId) //фильтруем по id пользователя
      .single() //возвращаем один результат
    if (error) throw error
    return data
  })
}
