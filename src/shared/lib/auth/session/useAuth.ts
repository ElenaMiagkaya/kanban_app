import { useContext } from 'react' //нужен для чтения контекста
import { AuthContext } from './AuthContext' //импортируем контекст

export const useAuth = () => {
  const context = useContext(AuthContext) //читаем контекст
  // если контекст не найден, выбрасываем ошибку
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  // возвращаем контекст
  return context
}
