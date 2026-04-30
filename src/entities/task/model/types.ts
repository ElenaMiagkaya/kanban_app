export type Task = {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in-progress' | 'done'
  createdAt: string
  updatedAt: string
}
