import type { Board } from '@entities/board'

export type Project = {
  id: string
  title: string
  description: string | null
  createdAt: string
  updatedAt: string
  boards: Board[]
}
