import { createClient } from '@/lib/supabase/server'
import type { Account, DebtAccount } from '@/lib/types'

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

  return (data ?? []).map((a) => ({
    ...a,
    balance: parseFloat(a.balance),
    interest_rate: a.interest_rate != null ? parseFloat(a.interest_rate) : null,
    minimum_payment: a.minimum_payment != null ? parseFloat(a.minimum_payment) : null,
  }))
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

export async function getDebtAccounts(): Promise<DebtAccount[]> {
  const accounts = await getAccounts()
  return accounts
    .filter((a) => !a.is_asset && a.interest_rate != null && a.minimum_payment != null)
    .map((a) => ({
      id: a.id,
      name: a.name,
      balance: a.balance,
      interest_rate: a.interest_rate!,
      minimum_payment: a.minimum_payment!,
    }))
}
