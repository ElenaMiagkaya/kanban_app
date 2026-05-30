import { supabase } from '../supabase/client' //импорт клиента supabase
import { withRetry } from '@/shared/lib' //импорт функции для retry

export const removeAvatarFile = async (userId: string): Promise<void> => {
  return withRetry(async () => {
    const path = `${userId}/avatar.jpg` //собирвем путь, он не будет меняться при удалении
    const { error } = await supabase.storage //удаляем файл из storage
      .from('avatars')
      .remove([path]) //ожидает массив путей
    if (error) throw error
  })
}
