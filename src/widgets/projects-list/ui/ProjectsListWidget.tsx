import { useProjects } from '@entities/project'
import { ProjectCard } from '@entities/project'
import { CreateProject } from '@features/create-project'
import { Link } from 'react-router-dom'
import { getProjectRoute } from '@shared/config'

const ProjectsListWidgets = () => {
  const { data: projects, isPending, isError, error, isLoading, user } = useProjects()

  if (isLoading || isPending) return <div>Загрузка проектов...</div>
  if (!user) return null

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h1>Мои проекты</h1>

      <div style={{ display: 'flex', gap: '20px' }}>
        {isError && <div>Ошибка: {error?.message}</div>}

        {!isPending && !isError && projects?.length === 0 && <div>Пока нет проектов</div>}

        {!isPending &&
          !isError &&
          projects &&
          projects.length > 0 &&
          projects.map((project) => (
            <Link className="project-tile__link" to={getProjectRoute(project.id)} key={project.id}>
              <ProjectCard project={project} />
            </Link>
          ))}
        <CreateProject />
      </div>
    </section>
  )
}

export default ProjectsListWidgets
