// Тип контекста
export interface AuthContextType {
  isLoading: boolean // загрузка статуса авторизации
  isAuth: boolean // есть ли сессия авторизации в Local Storage
  user: { id: string; email?: string | null } | null // пользователь
  signOut: () => Promise<void> // выход из аккаунта
  refreshAuth: () => Promise<void> // обновляет статус авторизации и пользователя
}
