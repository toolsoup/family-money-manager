import type { DebtAccount, FinancialGoal, SavingsGoal } from '@/lib/types'
import { calculatePayoff } from '@/lib/debt-calculator'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

// --- Net Worth Projection ---

export interface NetWorthDataPoint {
  month: number
  label: string
  value: number
}

export function projectNetWorth(
  currentNetWorth: number,
  monthlySurplus: number,
  months: number,
): NetWorthDataPoint[] {
  const data: NetWorthDataPoint[] = []
  const now = new Date()

  for (let m = 0; m <= months; m++) {
    const date = new Date(now.getFullYear(), now.getMonth() + m, 1)
    const label = m % 12 === 0
      ? date.getFullYear().toString()
      : date.toLocaleDateString('en-US', { month: 'short' })

    data.push({
      month: m,
      label: m === 0 ? 'Now' : label,
      value: round2(currentNetWorth + monthlySurplus * m),
    })
  }

  // Thin out data points for readability (keep every Nth point)
  if (data.length > 60) {
    const step = Math.ceil(data.length / 60)
    return data.filter((_, i) => i === 0 || i === data.length - 1 || i % step === 0)
  }

  return data
}

// --- Debt Payoff Projection ---

export interface DebtDataPoint {
  month: number
  label: string
  balance: number
}

export function projectDebtPayoff(
  debts: DebtAccount[],
  extraPayment: number,
  months: number,
): { data: DebtDataPoint[]; debtFreeMonth: number } {
  if (debts.length === 0) {
    return { data: [{ month: 0, label: 'Now', balance: 0 }], debtFreeMonth: 0 }
  }

  const result = calculatePayoff(debts, extraPayment)
  const avalanche = result.strategies.find((s) => s.strategy === 'avalanche')!
  const balances = avalanche.monthlyBalances

  const now = new Date()
  const data: DebtDataPoint[] = []
  const limit = Math.min(months, balances.length - 1)

  for (let m = 0; m <= limit; m++) {
    const date = new Date(now.getFullYear(), now.getMonth() + m, 1)
    const label = m % 12 === 0
      ? date.getFullYear().toString()
      : date.toLocaleDateString('en-US', { month: 'short' })

    data.push({
      month: m,
      label: m === 0 ? 'Now' : label,
      balance: balances[m] ?? 0,
    })
  }

  // Thin out for readability
  if (data.length > 60) {
    const step = Math.ceil(data.length / 60)
    const thinned = data.filter((_, i) => i === 0 || i === data.length - 1 || i % step === 0)
    return { data: thinned, debtFreeMonth: avalanche.months }
  }

  return { data, debtFreeMonth: avalanche.months }
}

// --- Savings Goal Projections ---

export interface SavingsGoalDataPoint {
  month: number
  label: string
  [goalName: string]: number | string
}

export function projectSavingsGoals(
  goals: SavingsGoal[],
  monthlySurplus: number,
  months: number,
): { data: SavingsGoalDataPoint[]; goalNames: string[] } {
  const activeGoals = goals.filter((g) => g.current_amount < g.target_amount)

  if (activeGoals.length === 0) {
    return { data: [], goalNames: [] }
  }

  const monthlyPerGoal = activeGoals.length > 0 && monthlySurplus > 0
    ? round2(monthlySurplus / activeGoals.length)
    : 0

  const now = new Date()
  const data: SavingsGoalDataPoint[] = []
  const goalNames = activeGoals.map((g) => g.name)

  for (let m = 0; m <= months; m++) {
    const date = new Date(now.getFullYear(), now.getMonth() + m, 1)
    const label = m % 12 === 0
      ? date.getFullYear().toString()
      : date.toLocaleDateString('en-US', { month: 'short' })

    const point: SavingsGoalDataPoint = {
      month: m,
      label: m === 0 ? 'Now' : label,
    }

    for (const goal of activeGoals) {
      const projected = goal.current_amount + monthlyPerGoal * m
      point[goal.name] = round2(Math.min(projected, goal.target_amount))
    }

    data.push(point)
  }

  // Thin out
  if (data.length > 60) {
    const step = Math.ceil(data.length / 60)
    return {
      data: data.filter((_, i) => i === 0 || i === data.length - 1 || i % step === 0),
      goalNames,
    }
  }

  return { data, goalNames }
}

// --- Goal Milestones ---

export interface GoalMilestone {
  percent: number
  value: number
  reached: boolean
  projectedDate: string | null
}

export function calculateGoalMilestones(
  goal: FinancialGoal,
  monthlyProgress: number,
): GoalMilestone[] {
  const now = new Date()
  const milestones = [25, 50, 75, 100]

  return milestones.map((percent) => {
    const value = round2(goal.target_value * percent / 100)
    const reached = goal.current_value >= value

    let projectedDate: string | null = null
    if (!reached && monthlyProgress > 0) {
      const remaining = value - goal.current_value
      const monthsNeeded = Math.ceil(remaining / monthlyProgress)
      const date = new Date(now.getFullYear(), now.getMonth() + monthsNeeded, 1)
      projectedDate = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    } else if (reached) {
      projectedDate = 'Reached'
    }

    return { percent, value, reached, projectedDate }
  })
}

// --- Debt-free date helper ---

export function getDebtFreeDate(debtFreeMonth: number): string {
  if (debtFreeMonth === 0) return 'Debt free!'
  const now = new Date()
  const date = new Date(now.getFullYear(), now.getMonth() + debtFreeMonth, 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
