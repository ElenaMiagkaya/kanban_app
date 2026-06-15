import { z } from 'zod'

export const nameSchema = z
  .string()
  .trim()
  .min(2, { message: 'Имя должно быть не менее 2 символов' })
  .max(20, { message: 'Имя должно быть не более 20 символов' })
  .regex(/^[A-Za-zА-Яа-яЁё\s_]+$/, {
    message: 'Имя должно содержать только буквы, пробелы и символы подчеркивания',
  })

export type NameSchema = z.infer<typeof nameSchema> // создаем тип данных для валидации формы регистрации(infer извлекает тип из схемы zod) и разрешаем на экспорт
