import { z } from 'zod'

export const createProjectSchema = z.object({
  title: z.string().trim().min(1, { message: 'Название проекта должно быть не менее 1 символа' }),
  description: z
    .string()
    .trim()
    .transform((val) => val || null)
    .optional(),
  projectPrefix: z
    .string()
    .trim()
    .regex(/^[A-Z]{3,5}$/, {
      message: 'Префикс проекта должен содержать 3-5 заглавных латинских букв',
    }),
})

export type CreateProjectSchema = z.infer<typeof createProjectSchema> //
