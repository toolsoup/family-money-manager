import type { CashFlowEntry, CashFlowFrequency } from '@/lib/types'

export function toMonthly(amount: number, frequency: CashFlowFrequency): number {
  switch (frequency) {
    case 'weekly': return Math.round(amount * 52 / 12 * 100) / 100
    case 'biweekly': return Math.round(amount * 26 / 12 * 100) / 100
    case 'monthly': return amount
    case 'annual': return Math.round(amount / 12 * 100) / 100
  }
}

export interface CategoryBreakdown {
  category: string
  monthlyAmount: number
}

export interface CashFlowSummary {
  totalMonthlyIncome: number
  totalMonthlyExpenses: number
  monthlySurplus: number
  incomeBreakdown: CategoryBreakdown[]
  expenseBreakdown: CategoryBreakdown[]
}

export function calculateCashFlowSummary(entries: CashFlowEntry[]): CashFlowSummary {
  const active = entries.filter((e) => e.is_active)

  const income = active.filter((e) => e.type === 'income')
  const expenses = active.filter((e) => e.type === 'expense')

  const totalMonthlyIncome = income.reduce((sum, e) => sum + toMonthly(e.amount, e.frequency), 0)
  const totalMonthlyExpenses = expenses.reduce((sum, e) => sum + toMonthly(e.amount, e.frequency), 0)

  const incomeByCategory = new Map<string, number>()
  for (const e of income) {
    const monthly = toMonthly(e.amount, e.frequency)
    incomeByCategory.set(e.category, (incomeByCategory.get(e.category) ?? 0) + monthly)
  }

  const expenseByCategory = new Map<string, number>()
  for (const e of expenses) {
    const monthly = toMonthly(e.amount, e.frequency)
    expenseByCategory.set(e.category, (expenseByCategory.get(e.category) ?? 0) + monthly)
  }

  return {
    totalMonthlyIncome: Math.round(totalMonthlyIncome * 100) / 100,
    totalMonthlyExpenses: Math.round(totalMonthlyExpenses * 100) / 100,
    monthlySurplus: Math.round((totalMonthlyIncome - totalMonthlyExpenses) * 100) / 100,
    incomeBreakdown: [...incomeByCategory.entries()]
      .map(([category, monthlyAmount]) => ({ category, monthlyAmount: Math.round(monthlyAmount * 100) / 100 }))
      .sort((a, b) => b.monthlyAmount - a.monthlyAmount),
    expenseBreakdown: [...expenseByCategory.entries()]
      .map(([category, monthlyAmount]) => ({ category, monthlyAmount: Math.round(monthlyAmount * 100) / 100 }))
      .sort((a, b) => b.monthlyAmount - a.monthlyAmount),
  }
}
