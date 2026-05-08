import { useState } from 'react'
import { signUpWithEmail } from '@shared/api'
import { useNavigate } from 'react-router-dom'
import { signUpSchema } from '../model/validation'
import { ROUTES } from '@shared/config'
import { mapAuthErrorToMessage } from '@shared/lib'

const SignUpByEmail = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    const form = e.currentTarget // Ссылка на саму форму <form>
    const formData = new FormData(form) // Браузер собирает все поля с атрибутом name

    const rawValues = {
      email: String(formData.get('email') ?? ''), // Достает значение из <input name="email"
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
    }
    const parsed = signUpSchema.safeParse(rawValues)
    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0].message)
      setIsLoading(false)
      return
    }
    try {
      const { email, password } = parsed.data
      await signUpWithEmail(email, password)
      form.reset()
      navigate(ROUTES.profile, { replace: true }) // переходим на страницу профиля и заменяем страницу в истории браузера,чтобы пользователь не мог вернуться на страницу регистрации
    } catch (error) {
      setErrorMessage(mapAuthErrorToMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Регистрация</h1>
        <input type="email" placeholder="Email" name="email" />
        <input type="password" placeholder="Пароль" name="password" />
        <input type="password" placeholder="Подтвердите пароль" name="confirmPassword" />
        <button type="submit" disabled={isLoading}>
          Зарегистрироваться
        </button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  )
}

export default SignUpByEmail
