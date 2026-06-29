import { supabase } from '../supabase/client'
import { withRetry } from '@shared/lib'

export const deleteProjectById = async (projectId: string) => {
  return withRetry(async () => {
    const { error } = await supabase.from('projects').delete().eq('id', projectId)

    if (error) throw error
  })
}
