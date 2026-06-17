import { useState, useEffect } from 'react'
import { getSession, signOut, supabase } from '@/shared/api'
import { AuthContext, type AuthContextType } from '@/shared/lib'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState<{ id: string; email?: string | null } | null>(null)

  // функция для обновления статуса авторизации (есть ли сессия в Local Storage)
  const refreshAuth = async () => {
    setIsLoading(true) //пока ждем ответа от сервера, устанавливаем состояние загрузки в true
    try {
      const data = await getSession() // получаем сессию из Local Storage
      const session = data.session
      if (session) {
        // если сессия есть, устанавливаем состояние авторизации в true и состояние пользователя в id и email
        setIsAuth(true)
        setUser({ id: session.user.id, email: session.user.email ?? null })
      } else {
        setIsAuth(false) // если сессии нет, устанавливаем состояние авторизации в false и состояние пользователя в null
        setUser(null)
      }
    } catch (error) {
      setIsAuth(false) // если ошибка, устанавливаем состояние авторизации в false и состояние пользователя в null
      setUser(null)
    } finally {
      setIsLoading(false) // по завершении устанавливаем состояние загрузки в false
    }
  }
  // вызываем функцию для обновления статуса авторизации при монтировании компонента
  useEffect(() => {
    refreshAuth()
    // подписываемся на изменения статуса авторизации
    const {
      // onAuthStateChange(...) возвращает объект примерно такого вида: data: { subscription: ... }
      // subscription: это объект, который содержит функцию unsubscribe() для отписки от событий
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      //_event - это событие, которое произошло
      if (session) {
        // если сессия есть, устанавливаем состояние авторизации в true и состояние пользователя в id и email
        setIsAuth(true)
        setUser({ id: session.user.id, email: session.user.email ?? null })
        setIsLoading(false)
      } else {
        // если сессии нет, устанавливаем состояние авторизации в false и состояние пользователя в null
        setIsAuth(false)
        setUser(null)
        setIsLoading(false)
      }
    })
    return () => {
      subscription.unsubscribe() // отписываемся от событий при размонтировании компонента
    }
  }, [])

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut() // вызываем функцию для удаления сессии из Local Storage
      setIsAuth(false) // устанавливаем состояние авторизации в false
      setUser(null) // устанавливаем состояние пользователя в null
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  // собираем значение контекста
  const authContextValue: AuthContextType = {
    isLoading,
    isAuth,
    user,
    signOut: handleSignOut,
    refreshAuth,
  }
  // возвращаем контекст с значением
  return <AuthContext value={authContextValue}>{children}</AuthContext>
}
