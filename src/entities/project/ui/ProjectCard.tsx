import type { ProjectListItem } from '../model/types'
import { formatDateRu } from '@shared/lib'

interface ProjectCardProps {
  project: ProjectListItem
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <article style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
      <h2>{project.title}</h2>
      <p>{formatDateRu(project.createdAt)}</p>
    </article>
  )
}

export default ProjectCard
