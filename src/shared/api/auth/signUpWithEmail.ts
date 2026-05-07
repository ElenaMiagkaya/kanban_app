import { supabase } from '../supabase/client'

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) {
    throw error
  }
  return data
}
