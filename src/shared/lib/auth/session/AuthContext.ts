import { createContext } from 'react'
import type { AuthContextType } from './AuthContextType' // импортируем тип контекста

// Создаем контекст с типом AuthContextType | null
export const AuthContext = createContext<AuthContextType | null>(null)
