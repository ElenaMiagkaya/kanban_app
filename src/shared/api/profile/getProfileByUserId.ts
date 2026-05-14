import { supabase } from '../supabase/client'

export const getProfileByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles') //таблица профилей
    .select('id,full_name,avatar_url') //выбираем поля из таблицы profiles в БД
    .eq('id', userId) //фильтруем по id пользователя
    .single() //возвращаем один результат
  if (error) throw error
  return data
}
