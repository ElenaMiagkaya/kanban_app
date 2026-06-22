import { getProjectsByOwnerId } from '@shared/api'
import { mapProjectRowToProjectListItem } from '../model/mapProjectRowToProject'
import type { ProjectListItem } from '../model/types'

export const getProjects = async (ownerId: string): Promise<ProjectListItem[]> => {
  const projects = await getProjectsByOwnerId(ownerId) //получаем массив списка проектов
  return projects.map(mapProjectRowToProjectListItem) //мапим массив проектов(возвращает массив проекто по доменной модели)
}
