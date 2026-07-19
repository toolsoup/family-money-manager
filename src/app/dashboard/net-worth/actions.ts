'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isLiabilityType } from '@/lib/types'
import type { AccountType } from '@/lib/types'

export async function createAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const type = formData.get('type') as AccountType
  const is_asset = isLiabilityType(type) ? false : true

  const isLiability = isLiabilityType(type)
  const rateStr = formData.get('interest_rate') as string
  const minPayStr = formData.get('minimum_payment') as string

  const { error } = await supabase.from('accounts').insert({
    user_id: user.id,
    name: formData.get('name') as string,
    type,
    balance: parseFloat(formData.get('balance') as string) || 0,
    institution: (formData.get('institution') as string) || null,
    notes: (formData.get('notes') as string) || null,
    is_asset,
    interest_rate: isLiability && rateStr ? parseFloat(rateStr) : null,
    minimum_payment: isLiability && minPayStr ? parseFloat(minPayStr) : null,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/net-worth')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/debt-destroyer')
  return { success: true }
}

export async function updateAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const id = formData.get('id') as string
  const type = formData.get('type') as AccountType
  const is_asset = isLiabilityType(type) ? false : true
  const isLiability = isLiabilityType(type)
  const rateStr = formData.get('interest_rate') as string
  const minPayStr = formData.get('minimum_payment') as string

  const { error } = await supabase
    .from('accounts')
    .update({
      name: formData.get('name') as string,
      type,
      balance: parseFloat(formData.get('balance') as string) || 0,
      institution: (formData.get('institution') as string) || null,
      notes: (formData.get('notes') as string) || null,
      is_asset,
      interest_rate: isLiability && rateStr ? parseFloat(rateStr) : null,
      minimum_payment: isLiability && minPayStr ? parseFloat(minPayStr) : null,
    })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/net-worth')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/debt-destroyer')
  return { success: true }
}

export async function deleteAccount(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('accounts').delete().eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/net-worth')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/debt-destroyer')
  return { success: true }
}
