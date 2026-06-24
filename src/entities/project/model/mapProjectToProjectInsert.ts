import type { CreateProjectInput } from './types'
import type { Database } from '@/types/database.types'

type ProjectInsert = Pick<
  Database['public']['Tables']['projects']['Insert'],
  'title' | 'description' | 'project_prefix'
>

export const mapProjectToProjectInsert = (project: CreateProjectInput): ProjectInsert => {
  return {
    title: project.title,
    description: project.description,
    project_prefix: project.projectPrefix,
  }
}
