import { supabase } from '../supabase/client'
import type { User } from '@supabase/supabase-js'
import { withRetry } from '@/shared/lib'

interface UpdateData {
  email?: string | null
  password?: string | null
}

export const updateAuthUser = async (updateData: UpdateData): Promise<{ user: User }> => {
  return withRetry(async () => {
    const { data, error } = await supabase.auth.updateUser({
      email: updateData.email,
      password: updateData.password,
    })
    if (error) throw error
    return data
  })
}
