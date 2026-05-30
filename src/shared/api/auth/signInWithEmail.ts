import { supabase } from '../supabase/client'
import { withRetry } from '@/shared/lib'
import type { Session } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<{ user: User; session: Session }> => {
  return withRetry(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      throw error
    }
    return data
  })
}
