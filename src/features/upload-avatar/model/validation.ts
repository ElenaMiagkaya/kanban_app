import { z } from 'zod'

const MAX_FILE_SIZE = 1024 * 1024 * 5 // 5MB

export const fileSchema = z
  .instanceof(File, { message: 'Файл не выбран' }) //проверяем, является ли файл экземпляром класса File
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    //проверяем, что файл нужного размера
    message: 'Файл слишком большой. Максимум 5 МБ',
  })
  .refine((file) => file.type.startsWith('image/'), {
    //проверяем, что файл является изображением
    message: 'Можно загружать только изображения',
  })

export type FileSchema = z.infer<typeof fileSchema>
