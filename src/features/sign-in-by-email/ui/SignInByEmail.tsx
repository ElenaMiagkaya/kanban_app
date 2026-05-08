import { useState } from 'react'
import { signInWithEmail } from '@shared/api'
import { useNavigate } from 'react-router-dom'
import { signInSchema } from '../model/validation'
import { ROUTES } from '@shared/config'
import { mapAuthErrorToMessage } from '@shared/lib'

const SignInByEmail = () => {
  const navigate = useNavigate() //функция для осуществления перехода по маршруту
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // функция для обработки отправки формы
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    const form = e.currentTarget // Ссылка на саму форму <form>
    const formData = new FormData(form) // Браузер собирает все поля с атрибутом name

    // создаем объект с данными из формы и валидируем их
    const rawValues = {
      email: String(formData.get('email') ?? ''), // Достает значение из <input name="email"
      password: String(formData.get('password') ?? ''),
    }
    // валидируем данные из формы
    const parsed = signInSchema.safeParse(rawValues)
    // если данные не валидны, устанавливаем сообщение об ошибке и выходим из функции
    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0].message)
      setIsLoading(false)
      return
    }
    try {
      // извлекаем данные из формы
      const { email, password } = parsed.data
      // вызываем функцию для входа по email
      await signInWithEmail(email, password)
      // сбрасываем форму
      form.reset()
      // переходим на страницу профиля и заменяем страницу в истории браузера,чтобы пользователь не мог вернуться на страницу входа
      navigate(ROUTES.profile, { replace: true })
      // если ошибка, устанавливаем сообщение об ошибке и выходим из функции
    } catch (error) {
      setErrorMessage(mapAuthErrorToMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Вход по email</h1>
        <input type="email" placeholder="Email" name="email" />
        <input type="password" placeholder="Пароль" name="password" />
        <button type="submit" disabled={isLoading}>
          Войти
        </button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  )
}

export default SignInByEmail
