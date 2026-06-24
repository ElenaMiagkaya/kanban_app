import { z } from 'zod'

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: 'Название проекта должно быть не менее 3-х символов' }),
  description: z
    .string()
    .trim()
    .transform((val) => val || null)
    .optional(),
  projectPrefix: z
    .string()
    .trim()
    .min(3, { message: 'Префикс проекта должен быть не менее 3-х символов' })
    .max(5, { message: 'Префикс проекта должно быть не более 5-ти символов' })
    .regex(/^[a-zA-Z]+$/, { message: 'Префикс проекта должен содержать только латинские буквы' }),
})

export type CreateProjectSchema = z.infer<typeof createProjectSchema> //
