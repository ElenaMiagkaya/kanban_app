import { z } from 'zod'

export const changeEmailSchema = (UserEmail: string) =>
  z.object({
    newEmail: z
      .email({ message: 'Введите корректный email' })
      .trim()
      .refine((email) => email !== UserEmail, {
        message: 'Email уже используется',
      }),
    password: z.string().min(8, { message: 'Пароль должен быть не менее 8 символов' }),
  })
