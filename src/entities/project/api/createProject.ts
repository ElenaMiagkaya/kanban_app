import { createNewProject } from '@shared/api'
import { mapProjectToProjectInsert } from '../model/mapProjectToProjectInsert'
import { mapProjectRowToProjectListItem } from '../model/mapProjectRowToProject'
import type { CreateProjectInput } from '../model/types'

export const createProject = async (input: CreateProjectInput, ownerId: string) => {
  const projectInsert = mapProjectToProjectInsert(input)
  const projectRow = await createNewProject(projectInsert, ownerId)
  return mapProjectRowToProjectListItem(projectRow)
}
