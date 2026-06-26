import type { ProjectListItem } from '../model/types'
import { formatDateRu } from '@shared/lib'
import { Card } from '@shared/ui'

interface ProjectCardProps {
  project: ProjectListItem
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card>
      <h2>{project.title}</h2>
      <p>{formatDateRu(project.createdAt)}</p>
    </Card>
  )
}

export default ProjectCard
