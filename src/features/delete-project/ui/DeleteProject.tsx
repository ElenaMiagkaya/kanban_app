import { useState } from 'react'
import { useDeleteProject } from '../model/useDeleteProject'
import { Modal } from '@shared/ui'

const DeleteProject = ({ projectId }: { projectId: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    mutate: deleteProject,
    isPending,
    isError,
    reset,
  } = useDeleteProject(projectId, () => {
    setIsOpen(false)
  })

  const handleDeleteProject = () => {
    setIsOpen(true)
    reset()
  }

  return (
    <>
      <button
        onClick={handleDeleteProject}
        disabled={isPending}
        type="button"
        aria-label="Удалить проект"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          color: 'red',
          position: 'absolute',
          top: '0',
          right: '0',
        }}
      >
        ✖
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Удалить проект?"
        description="При удалении проекта будут удалены все задачи в нём"
        isCloseDisabled={isPending}
      >
        <button
          onClick={() => deleteProject()}
          disabled={isPending}
          type="button"
          aria-label="Удалить проект"
        >
          Удалить
        </button>
        <button
          onClick={() => setIsOpen(false)}
          disabled={isPending}
          type="button"
          aria-label="Отменить удаление проекта"
        >
          Отмена
        </button>
        {isError && <p>Ошибка при удалении проекта</p>}
      </Modal>
    </>
  )
}

export default DeleteProject
