'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/dashboard/planning')
  revalidatePath('/dashboard')
}

export async function createGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('financial_goals').insert({
    user_id: user.id,
    name: formData.get('name') as string,
    category: formData.get('category') as string,
    target_value: parseFloat(formData.get('target_value') as string) || 0,
    current_value: parseFloat(formData.get('current_value') as string) || 0,
    target_date: (formData.get('target_date') as string) || null,
    notes: (formData.get('notes') as string) || null,
  })

  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}

export async function updateGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('financial_goals')
    .update({
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      target_value: parseFloat(formData.get('target_value') as string) || 0,
      current_value: parseFloat(formData.get('current_value') as string) || 0,
      target_date: (formData.get('target_date') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', formData.get('id') as string)

  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}

export async function deleteGoal(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('financial_goals').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}
