import { useProjects } from '@entities/project'
import { ProjectCard } from '@entities/project'
import { CreateProject } from '@features/create-project'

const ProjectsListWidgets = () => {
  const { data: projects, isPending, isError, error, isLoading, user } = useProjects()

  if (isLoading || isPending) return <div>Загрузка проектов...</div>
  if (!user) return null

  return (
    <section>
      <h1>Мои проекты</h1>

      {isError && <div>Ошибка: {error?.message}</div>}

      {!isPending && !isError && projects?.length === 0 && <div>Пока нет проектов</div>}

      {!isPending &&
        !isError &&
        projects &&
        projects.length > 0 &&
        projects.map((project) => <ProjectCard key={project.id} project={project} />)}
      <CreateProject />
    </section>
  )
}

export default ProjectsListWidgets
