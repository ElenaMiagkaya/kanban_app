import { Link } from 'react-router-dom'
import { ROUTES } from '@shared/config'

const NavigateToSignUp = () => {
  return (
    <Link to={ROUTES.signUp as string} aria-label="Перейти на страницу регистрации">
      Регистрацияе
    </Link>
  )
}

export default NavigateToSignUp
