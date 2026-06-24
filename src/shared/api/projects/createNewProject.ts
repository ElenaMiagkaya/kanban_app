import { supabase } from '../supabase/client'
import { withRetry } from '@/shared/lib'
import type { Database } from '@/types/database.types'

type ProjectRow = Pick<
  Database['public']['Tables']['projects']['Row'],
  'title' | 'id' | 'created_at'
>

type ProjectInsert = Pick<
  Database['public']['Tables']['projects']['Insert'],
  'title' | 'description' | 'project_prefix'
>

export const createNewProject = async (
  projectInsert: ProjectInsert,
  ownerId: string,
): Promise<ProjectRow> => {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...projectInsert,
        owner_id: ownerId,
      })
      .select('id, title, created_at')
      .single()
    if (error) throw error
    return data
  })
}
