import type { Database } from '@/types/database.types'
import type { Project, ProjectListItem } from './types'

// тип для проекта в списке проектов в профиле
type ProjectListItemRow = Pick<
  Database['public']['Tables']['projects']['Row'],
  'id' | 'title' | 'created_at'
>

// тип для проекта на странице проекта
type ProjectRow = ProjectListItemRow & {
  updated_at: string
  description: string | null
  project_prefix: string
}

// маппер для проекта в списке проектов в профиле
export const mapProjectRowToProjectListItem = (projectRow: ProjectListItemRow): ProjectListItem => {
  return {
    id: projectRow.id,
    title: projectRow.title,
    createdAt: projectRow.created_at,
  }
}

//
export const mapProjectRowToProject = (projectRow: ProjectRow): Project => {
  return {
    ...mapProjectRowToProjectListItem(projectRow),
    description: projectRow.description,
    updatedAt: projectRow.updated_at,
    projectPrefix: projectRow.project_prefix,
    boards: [],
  }
}
