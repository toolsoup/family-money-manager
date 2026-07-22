import { createClient } from '@/lib/supabase/server'
import type { Account, DebtAccount, CashFlowEntry, SavingsGoal, Document, FinancialGoal } from '@/lib/types'

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

export async function getCashFlowEntries(): Promise<CashFlowEntry[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('cash_flow_entries')
    .select('*')
    .order('type')
    .order('name')

  if (error) {
    console.error('Error fetching cash flow entries:', error)
    return []
  }

  return (data ?? []).map((e) => ({ ...e, amount: parseFloat(e.amount) }))
}

export async function getSavingsGoals(): Promise<SavingsGoal[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .order('deadline', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('Error fetching savings goals:', error)
    return []
  }

  return (data ?? []).map((g) => ({
    ...g,
    target_amount: parseFloat(g.target_amount),
    current_amount: parseFloat(g.current_amount),
  }))
}

export async function getDocuments(): Promise<Document[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.error('Error fetching documents:', error)
    return []
  }

  return (data ?? []).map((d) => ({
    ...d,
    file_size: Number(d.file_size),
    tags: d.tags ?? null,
  }))
}

export async function getFinancialGoals(): Promise<FinancialGoal[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('financial_goals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching financial goals:', error)
    return []
  }

  return (data ?? []).map((g) => ({
    ...g,
    target_value: parseFloat(g.target_value),
    current_value: parseFloat(g.current_value),
  }))
}
