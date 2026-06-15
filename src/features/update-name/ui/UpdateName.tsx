import { useState, useRef, useEffect } from 'react'
import { nameSchema } from '../model/validation'
import { useUpdateName } from '../model/useUpdateName'

const UpdateName = ({ name }: { name: string }) => {
  const { mutate, isPending, isError, reset } = useUpdateName()

  const inputRef = useRef<HTMLInputElement>(null)
  const [userName, setUserName] = useState<string>(name)
  const [errorValidation, setErrorValidation] = useState<string | null>(null)

  useEffect(() => {
    setUserName(name)
  }, [name])

  const handleUpdateName = () => {
    setErrorValidation(null) //сбросить ошибку валидации
    const parsedName = nameSchema.safeParse(userName.trim()) //валидируем имя, убирая пробелы
    if (!parsedName.success) {
      //если имя не прошло валидацию, выводим ошибку в UI
      setErrorValidation(parsedName.error.issues[0].message)
      return
    }
    if (parsedName.data === name.trim()) return //если имя не изменилось, не выполняем мутацию
    mutate(parsedName.data, {
      onSuccess: () => {
        inputRef.current?.blur() //убираем фокус с input
      },
    }) //выполняем мутацию
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value) //устанавливаем новое имя
    setErrorValidation(null) //сбросить ошибку валидации при изменении имени
    reset() //сбросить ошибку прошлой мутации при изменении имени
  }

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        aria-label="Имя пользователя"
        value={userName}
        onChange={(e) => handleChange(e)}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return //если не Enter, не выполняем мутацию
          e.preventDefault()
          handleUpdateName()
        }}
      />

      {errorValidation && <p>{errorValidation}</p>}
      {isPending && <p>Загрузка...</p>}
      {isError && <p>Ошибка при добавлении имени</p>}
    </>
  )
}

export default UpdateName
