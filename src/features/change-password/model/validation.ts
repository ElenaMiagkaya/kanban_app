import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    newPassword: z.string().trim().min(8, { message: 'Пароль должен быть не менее 8 символов' }),
    confirmPassword: z.string().min(8, { message: 'Пароль должен быть не менее 8 символов' }),
    currentPassword: z.string().min(8, { message: 'Пароль должен быть не менее 8 символов' }),
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    path: ['confirmPassword'],
    message: 'Пароли не совпадают',
  })
  .refine(({ newPassword, currentPassword }) => newPassword !== currentPassword, {
    path: ['newPassword'],
    message: 'Новый пароль не может совпадать с текущим паролем',
  })
