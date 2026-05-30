import { supabase } from '../supabase/client'
import { withRetry } from '@/shared/lib'
import type { User } from '@supabase/supabase-js'

export const getCurrentUser = async (): Promise<{ user: User }> => {
  return withRetry(async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      throw error
    }
    return data
  })
}
