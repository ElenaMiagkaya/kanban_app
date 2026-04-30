import type { Column } from '@entities/column'

export type Board = {
  id: string
  title: string
  columns: Column[]
}
