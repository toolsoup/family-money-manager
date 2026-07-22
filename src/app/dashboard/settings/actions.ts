'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
}

export async function updatePreferences(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .update({
      default_timeframe: parseInt(formData.get('default_timeframe') as string, 10) || 5,
    })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}

export async function disconnectPlaidItem(itemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Cascade delete removes plaid_accounts automatically
  const { error } = await supabase
    .from('plaid_items')
    .delete()
    .eq('id', itemId)

  if (error) return { success: false, error: error.message }
  revalidateAll()
  return { success: true }
}
