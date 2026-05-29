import { supabase } from '../supabase/client' //импорт клиента supabase

export const uploadAvatarFile = async (file: File, userId: string): Promise<string> => {
  const path = `${userId}/avatar.jpg` //собирвем путь, он не будет меняться при загрузке

  const { error } = await supabase.storage //загружаем файл в storage
    .from('avatars')
    .upload(path, file, {
      upsert: true, //если файл уже существует, то загружаем его заново
      contentType: file.type || 'image/png', //указываем тип файла, если не указан, то по умолчанию image/png
    })
  if (error) throw error //если ошибка, то выбрасываем ее
  const { data } = supabase.storage.from('avatars').getPublicUrl(path) //получаем публичный URL файла
  return `${data.publicUrl}?v=${Date.now()}` //возвращаем публичный URL файла с добавлением timestamp для обновления кеша
}
