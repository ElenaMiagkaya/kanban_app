import { supabase } from '../supabase/client' //импорт клиента supabase

export const removeAvatarFile = async (userId: string) => {
  const path = `${userId}/avatar.jpg` //собирвем путь, он не будет меняться при удалении
  const { error } = await supabase.storage //удаляем файл из storage
    .from('avatars')
    .remove([path]) //ожидает массив путей
  if (error) throw error
}
