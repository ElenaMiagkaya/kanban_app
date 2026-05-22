// клиент
export { supabase } from './supabase/client'
// функции для работы с аутентификацией
export { signUpWithEmail } from './auth/signUpWithEmail'
export { signInWithEmail } from './auth/signInWithEmail'
export { signOut } from './auth/signOut'
export { getSession } from './auth/getSession'
export { getCurrentUser } from './auth/getCurrentUser'
// функции для работы с профилем
export { getProfileByUserId } from './profile/getProfileByUserId'
export { updateProfileByUserId } from './profile/updateProfileByUserId'
