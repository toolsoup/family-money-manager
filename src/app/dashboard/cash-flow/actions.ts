'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/dashboard/cash-flow')
  revalidatePath('/dashboard')
}

// --- Cash Flow Entries ---

export async function createCashFlowEntry(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('cash_flow_entries').insert({
    user_id: user.id,
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    category: formData.get('category') as string,
    amount: parseFloat(formData.get('amount') as string) || 0,
    frequency: formData.get('frequency') as string,
    notes: (formData.get('notes') as string) || null,
  })

  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}

export async function updateCashFlowEntry(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('cash_flow_entries')
    .update({
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      category: formData.get('category') as string,
      amount: parseFloat(formData.get('amount') as string) || 0,
      frequency: formData.get('frequency') as string,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', formData.get('id') as string)

  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}

export async function deleteCashFlowEntry(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('cash_flow_entries').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}

// --- Savings Goals ---

export async function createSavingsGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('savings_goals').insert({
    user_id: user.id,
    name: formData.get('name') as string,
    target_amount: parseFloat(formData.get('target_amount') as string) || 0,
    current_amount: parseFloat(formData.get('current_amount') as string) || 0,
    deadline: (formData.get('deadline') as string) || null,
    notes: (formData.get('notes') as string) || null,
  })

  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}

export async function updateSavingsGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('savings_goals')
    .update({
      name: formData.get('name') as string,
      target_amount: parseFloat(formData.get('target_amount') as string) || 0,
      current_amount: parseFloat(formData.get('current_amount') as string) || 0,
      deadline: (formData.get('deadline') as string) || null,
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', formData.get('id') as string)

  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}

export async function deleteSavingsGoal(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('savings_goals').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}
