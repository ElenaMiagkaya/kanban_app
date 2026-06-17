import { useState } from 'react'
import { Modal } from '@shared/ui'
import { Button } from '@shared/ui'
import { changeEmailSchema } from '../model/validation'
import { useChangeEmail } from '../model/useChangeEmail'
import { mapAuthErrorToMessage } from '@shared/lib'

const ChangeEmail = ({ UserEmail }: { UserEmail: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [errorValidation, setErrorValidation] = useState<string | null>(null)
  const {
    mutate: changeEmail,
    isPending,
    isError,
    reset,
    error,
    isSuccess,
  } = useChangeEmail(UserEmail)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    setErrorValidation(null) //сбросить ошибку валидации
    reset() //сбросить ошибку прошлой мутации
    e.preventDefault() //предотвратить стандартное поведение формы

    const formData = new FormData(e.target) //собираем данные из формы в переменную formData
    const newEmail = formData.get('newEmail') as string //получаем значение из поля newEmail
    const password = formData.get('password') as string //получаем значение из поля password

    //валидируем данные из формы
    const parsed = changeEmailSchema(UserEmail).safeParse({ newEmail, password })
    //если данные не прошли валидацию, устанавливаем сообщение об ошибке и выходим из функции
    if (!parsed.success) {
      setErrorValidation(parsed.error.issues[0].message)
      return
    }
    changeEmail({ newEmail, password }) //вызываем мутацию для изменения email при успешной валидации
  }

  //функция для обработки изменения значения в input(сбросить ошибку валидации и ошибку прошлой мутации)
  const handleChange = () => {
    setErrorValidation(null)
    reset()
  }

  //функция для открытия модального окна
  const handleOpen = () => {
    setIsOpen(true)
    setErrorValidation(null)
    reset()
  }

  return (
    <div>
      <button onClick={handleOpen}>Изменить</button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Изменить email"
        description={isSuccess ? null : `Ваш текущий email: ${UserEmail}`}
      >
        {/* если email успешно изменен, выводим сообщение о том, что мы отправили письмо для подтверждения */}
        {isSuccess ? (
          <p>Мы отправили письмо для подтверждения. Проверьте старую и новую почту.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Новый email"
              name="newEmail"
              autoComplete="new-email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Ваш пароль"
              name="password"
              autoComplete="new-password"
              onChange={handleChange}
            />
            <Button type="submit" onClick={() => {}} disabled={isPending}>
              {isPending ? 'Изменение...' : 'Изменить email'}
            </Button>
            {isError && error && <p>Ошибка: {mapAuthErrorToMessage(error)}</p>}
            {errorValidation && <p>{errorValidation}</p>}
          </form>
        )}
      </Modal>
    </div>
  )
}

export default ChangeEmail
