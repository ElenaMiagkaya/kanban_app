import { transliterateCyrillicToLatin } from '@shared/lib'

export const deriveProjectPrefixFromTitle = (title: string): string => {
  const firstWord = title.trim().split(/\s+/)[0] ?? '' // первое слово из названия проекта
  // если первое слово не найдено, возвращаем пустую строку
  if (!firstWord) return ''
  // преобразуем первое слово в латинские буквы
  // ищем все латинские буквы в первом слове
  const letters = transliterateCyrillicToLatin(firstWord).match(/[a-z]/gi) ?? []
  // возвращаем первые три буквы в верхнем регистре
  return letters.slice(0, 3).join('').toUpperCase()
}
