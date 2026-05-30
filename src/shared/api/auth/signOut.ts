import { supabase } from '../supabase/client'
import { withRetry } from '@/shared/lib'

export const signOut = async (): Promise<void> => {
  return withRetry(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  })
}
