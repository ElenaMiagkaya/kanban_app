import { useState } from 'react'
import { Modal } from '@shared/ui'
import { Button } from '@shared/ui'
import { useCreateProject } from '../model/useCreateProject'
import { createProjectSchema } from '../model/validation'
import { mapAuthErrorToMessage } from '@shared/lib'
import { deriveProjectPrefixFromTitle } from '@entities/project'

const CreateProject = () => {
  const [isOpen, setIsOpen] = useState(false) // состояние для открытия/закрытия модального окна
  const [errorValidation, setErrorValidation] = useState<string | null>(null) // состояние для ошибки валидации
  const [projectPrefix, setProjectPrefix] = useState<string>('') // состояние для префикса проекта
  const [isPrefixTouched, setIsPrefixTouched] = useState(false) // состояние для отметки того, что префикс проекта был touched
  const { mutate: createProject, isError, isPending, error, reset } = useCreateProject()

  // функция для обработки открытия модального окна
  const handleCreateProject = () => {
    setIsOpen(true)
    setIsPrefixTouched(false)
    setProjectPrefix('')
    setErrorValidation(null)
    reset()
  }
  // функция для обработки отправки формы
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorValidation(null)
    reset()

    const formData = new FormData(e.target)
    const input = {
      title: formData.get('title') as string,
      description: formData.get('description') as string | null,
      projectPrefix: formData.get('projectPrefix') as string,
    }

    const parsed = createProjectSchema.safeParse(input)
    if (!parsed.success) {
      setErrorValidation(parsed.error.issues[0].message)
      return
    }
    // при успешной валидации, создаем проект
    createProject(parsed.data, {
      onSuccess: () => {
        setIsOpen(false)
        setIsPrefixTouched(false)
        setProjectPrefix('')
        e.currentTarget.reset()
      },
    })
  }
  // функция для обработки изменения значения в input
  const handleChange = () => {
    setErrorValidation(null)
    reset()
  }

  // функция для обработки изменения значения в input названия проекта
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange() // сброс ошибок
    if (!isPrefixTouched) {
      // если префикс проекта не был touched, то устанавливаем префикс автоматически с помощью функции транслитерации
      setProjectPrefix(deriveProjectPrefixFromTitle(e.target.value))
    }
  }

  // функция для обработки изменения значения в input префикса проекта
  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrefixTouched(true) // устанавливаем флаг того, что префикс проекта был touched
    setProjectPrefix(e.target.value) // устанавливаем значение префикса проекта, которое ввел пользователь
    handleChange() // сброс ошибок
  }

  return (
    <div>
      <button onClick={handleCreateProject}>Создать проект</button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Новый проект"
        isCloseDisabled={isPending}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          <input
            type="text"
            placeholder="Название проекта"
            name="title"
            onChange={handleTitleChange}
          />
          <input
            type="text"
            placeholder="Описание проекта"
            name="description"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Префикс проекта"
            name="projectPrefix"
            value={projectPrefix}
            onChange={handlePrefixChange}
            autoComplete="off"
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Создание...' : 'Создать проект'}
          </Button>
          {isError && error && <p>Ошибка при создании проекта: {mapAuthErrorToMessage(error)}</p>}
          {errorValidation && <p>{errorValidation}</p>}
        </form>
      </Modal>
    </div>
  )
}

export default CreateProject
