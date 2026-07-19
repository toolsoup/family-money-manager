import type { DebtAccount, PayoffStrategyType } from '@/lib/types'

export interface PayoffResult {
  strategy: PayoffStrategyType
  label: string
  months: number
  totalInterestPaid: number
  totalPaid: number
  debtPayoffOrder: Array<{ id: string; name: string; paidOffMonth: number }>
  monthlyBalances: number[] // total balance at each month, for charting
}

export interface DebtCalculatorOutput {
  strategies: PayoffResult[]
  bestForInterest: PayoffStrategyType
  bestForTime: PayoffStrategyType
}

const STRATEGY_LABELS: Record<PayoffStrategyType, string> = {
  avalanche: 'Avalanche',
  snowball: 'Snowball',
  hybrid: 'Hybrid',
  highest_payment: 'Highest Payment',
  custom: 'Custom Order',
  minimum_only: 'Minimum Only',
}

const MAX_MONTHS = 600

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function getSortedIds(debts: DebtAccount[], strategy: PayoffStrategyType, customOrder?: string[]): string[] {
  const sorted = [...debts]
  switch (strategy) {
    case 'avalanche':
      sorted.sort((a, b) => b.interest_rate - a.interest_rate)
      break
    case 'snowball':
      sorted.sort((a, b) => a.balance - b.balance)
      break
    case 'hybrid':
      sorted.sort((a, b) => (b.balance * b.interest_rate) - (a.balance * a.interest_rate))
      break
    case 'highest_payment':
      sorted.sort((a, b) => b.minimum_payment - a.minimum_payment)
      break
    case 'custom':
      if (customOrder) {
        const orderMap = new Map(customOrder.map((id, i) => [id, i]))
        sorted.sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999))
      }
      break
    case 'minimum_only':
      break
  }
  return sorted.map((d) => d.id)
}

function simulatePayoff(
  debts: DebtAccount[],
  extraPayment: number,
  priorityOrder: string[],
): PayoffResult & { _strategy: PayoffStrategyType } {
  const balances = new Map(debts.map((d) => [d.id, d.balance]))
  const debtMap = new Map(debts.map((d) => [d.id, d]))
  const payoffOrder: PayoffResult['debtPayoffOrder'] = []
  const monthlyBalances: number[] = []

  let totalInterest = 0
  let totalPaid = 0
  let freedPayments = 0
  let month = 0

  const totalStartBalance = debts.reduce((s, d) => s + d.balance, 0)
  monthlyBalances.push(round2(totalStartBalance))

  while (month < MAX_MONTHS) {
    const activeDebts = debts.filter((d) => (balances.get(d.id) ?? 0) > 0)
    if (activeDebts.length === 0) break

    month++

    // 1. Apply interest
    for (const debt of activeDebts) {
      const bal = balances.get(debt.id)!
      const monthlyRate = debt.interest_rate / 100 / 12
      const interest = round2(bal * monthlyRate)
      balances.set(debt.id, round2(bal + interest))
      totalInterest = round2(totalInterest + interest)
    }

    // 2. Apply minimum payments
    for (const debt of activeDebts) {
      const bal = balances.get(debt.id)!
      const payment = Math.min(debt.minimum_payment, bal)
      balances.set(debt.id, round2(bal - payment))
      totalPaid = round2(totalPaid + payment)
    }

    // 3. Apply extra + freed payments to highest priority debt
    let available = round2(extraPayment + freedPayments)
    for (const id of priorityOrder) {
      if (available <= 0) break
      const bal = balances.get(id) ?? 0
      if (bal <= 0) continue
      const payment = Math.min(available, bal)
      balances.set(id, round2(bal - payment))
      totalPaid = round2(totalPaid + payment)
      available = round2(available - payment)
    }

    // 4. Check for newly paid-off debts
    for (const debt of activeDebts) {
      if ((balances.get(debt.id) ?? 0) <= 0) {
        balances.set(debt.id, 0)
        payoffOrder.push({ id: debt.id, name: debt.name, paidOffMonth: month })
        freedPayments = round2(freedPayments + debt.minimum_payment)
      }
    }

    const totalBal = debts.reduce((s, d) => s + (balances.get(d.id) ?? 0), 0)
    monthlyBalances.push(round2(totalBal))
  }

  return {
    _strategy: 'minimum_only',
    strategy: 'minimum_only',
    label: '',
    months: month,
    totalInterestPaid: totalInterest,
    totalPaid,
    debtPayoffOrder: payoffOrder,
    monthlyBalances,
  }
}

export function calculatePayoff(
  debts: DebtAccount[],
  extraMonthlyPayment: number,
  customOrder?: string[],
): DebtCalculatorOutput {
  if (debts.length === 0) {
    const empty: PayoffResult = {
      strategy: 'minimum_only',
      label: 'Minimum Only',
      months: 0,
      totalInterestPaid: 0,
      totalPaid: 0,
      debtPayoffOrder: [],
      monthlyBalances: [0],
    }
    return {
      strategies: (['avalanche', 'snowball', 'hybrid', 'highest_payment', 'custom', 'minimum_only'] as PayoffStrategyType[])
        .map((s) => ({ ...empty, strategy: s, label: STRATEGY_LABELS[s] })),
      bestForInterest: 'avalanche',
      bestForTime: 'avalanche',
    }
  }

  const strategies: PayoffResult[] = (
    ['avalanche', 'snowball', 'hybrid', 'highest_payment', 'custom', 'minimum_only'] as PayoffStrategyType[]
  ).map((strategy) => {
    const extra = strategy === 'minimum_only' ? 0 : extraMonthlyPayment
    const order = getSortedIds(debts, strategy, customOrder)
    const result = simulatePayoff(debts, extra, order)
    return {
      ...result,
      strategy,
      label: STRATEGY_LABELS[strategy],
    }
  })

  const withExtra = strategies.filter((s) => s.strategy !== 'minimum_only')
  const bestForInterest = withExtra.reduce((best, s) =>
    s.totalInterestPaid < best.totalInterestPaid ? s : best
  ).strategy
  const bestForTime = withExtra.reduce((best, s) =>
    s.months < best.months ? s : best
  ).strategy

  return { strategies, bestForInterest, bestForTime }
}
