import { z } from 'zod'

// создаем схему валидации формы регистрации
export const signUpSchema = z
  .object({
    email: z.email({ message: 'Введите корректный email' }),
    password: z
      .string()
      .min(8, { message: 'Пароль должен быть не менее 8 символов' })
      .regex(/^[\x00-\x7F]+$/, {
        message: 'Пароль должен содержать только латинские буквы и цифры',
      }),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'], //к какому полю привязат ошибку
    message: 'Пароли не совпадают', //текст ошибки
  })

export type SignUpSchema = z.infer<typeof signUpSchema> // создаем тип данных для валидации формы регистрации(infer извлекает тип из схемы zod) и разрешаем на экспорт
