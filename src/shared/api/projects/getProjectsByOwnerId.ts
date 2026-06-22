import { supabase } from '../supabase/client'
import { withRetry } from '@/shared/lib'
import type { Database } from '@/types/database.types'

type ProjectListItemRow = Pick<
  Database['public']['Tables']['projects']['Row'],
  'id' | 'title' | 'created_at'
>

export const getProjectsByOwnerId = async (ownerId: string): Promise<ProjectListItemRow[]> => {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('projects') //из таблицы projects
      .select('id, title, created_at') //выбираем id и title и created_at
      .eq('owner_id', ownerId) //фильтруем по owner_id
      .order('created_at', { ascending: false }) //сортируем по дате создания по убыванию
    if (error) throw error
    return data || [] //если данных нет, то возвращаем пустой массив, а не null
  })
}
