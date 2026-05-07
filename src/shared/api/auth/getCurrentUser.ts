import { supabase } from '../supabase/client'

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    throw error
  }
  return data
}
