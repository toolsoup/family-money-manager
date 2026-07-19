import { createClient } from '@/lib/supabase/server'
import type { Account } from '@/lib/types'

export async function getAccounts(): Promise<Account[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('type')
    .order('name')

  if (error) {
    console.error('Error fetching accounts:', error)
    return []
  }

  return (data ?? []).map((a) => ({ ...a, balance: parseFloat(a.balance) }))
}

export async function getNetWorthSummary() {
  const accounts = await getAccounts()

  const totalAssets = accounts
    .filter((a) => a.is_asset)
    .reduce((sum, a) => sum + a.balance, 0)

  const totalLiabilities = accounts
    .filter((a) => !a.is_asset)
    .reduce((sum, a) => sum + a.balance, 0)

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
    accountCount: accounts.length,
  }
}
