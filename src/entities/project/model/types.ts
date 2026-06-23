import type { Board } from '@entities/board'

// тип для списка проектов
export type ProjectListItem = {
  id: string
  title: string
  createdAt: string
}

// тип для проекта
export type Project = ProjectListItem & {
  description: string | null
  updatedAt: string
  projectPrefix: string
  boards: Board[]
}
