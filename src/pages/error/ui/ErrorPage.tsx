import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div>
      <h1>Упс! Что-то пошло не так</h1>
      <p>Мы не можем найти страницу, которую вы ищете</p>
      <Link to="/">Вернуться на главную</Link>
    </div>
  )
}

export default ErrorPage
