import { supabase } from '../supabase/client'
import { withRetry } from '@/shared/lib'
import type { Session } from '@supabase/supabase-js'

export const getSession = async (): Promise<{ session: Session | null }> => {
  return withRetry(async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      throw error
    }
    return data
  })
}
