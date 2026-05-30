import { supabase } from '../supabase/client'
import { withRetry } from '@/shared/lib'
import type { User } from '@supabase/supabase-js'
import type { Session } from '@supabase/supabase-js'

export const signUpWithEmail = async (
  email: string,
  password: string,
): Promise<{ user: User | null; session: Session | null }> => {
  return withRetry(async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      throw error
    }
    return data
  })
}
