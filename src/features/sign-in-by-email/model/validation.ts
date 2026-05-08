import { z } from 'zod'

// создаем схему валидации формы входа по email
export const signInSchema = z.object({
  email: z.email({ message: 'Введите корректный email' }),
  password: z.string().min(8, { message: 'Пароль должен быть не менее 8 символов' }),
})

export type SignInSchema = z.infer<typeof signInSchema> // создаем тип данных для валидации формы входа по email(infer извлекает тип из схемы zod) и разрешаем на экспорт
