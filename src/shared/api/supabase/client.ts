import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const [supabaseUrl, supabasePublishableKey] = [
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
]

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Ошибка: не найдены переменные окружения для Supabase. Проверьте файл .env')
}

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey)
