import type { Task } from '@entities/task'

export type Column = {
  id: string
  title: string
  tasks: Task[]
}
