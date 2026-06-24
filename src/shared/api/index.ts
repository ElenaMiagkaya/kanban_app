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
export { updateAuthUser } from './auth/updateAuthUser'
// функции для работы с storage
export { uploadAvatarFile } from './storage/uploadAvatarFile'
export { removeAvatarFile } from './storage/removeAvatarFile'

// функции для работы с проектами
export { getProjectsByOwnerId } from './projects/getProjectsByOwnerId' //список проектов по owner_id
export { createNewProject } from './projects/createNewProject' //создание нового проекта
