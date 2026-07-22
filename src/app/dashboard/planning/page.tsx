import {
  getNetWorthSummary,
  getDebtAccounts,
  getCashFlowEntries,
  getSavingsGoals,
  getFinancialGoals,
} from '@/lib/queries'
import { calculateCashFlowSummary } from '@/lib/cash-flow-calculator'
import { getDebtFreeDate } from '@/lib/projection-calculator'
import { calculatePayoff } from '@/lib/debt-calculator'
import { formatCurrency, formatMonths } from '@/lib/format'
import { ProjectionCharts } from '@/components/projection-charts'
import { GoalList } from '@/components/goal-list'

export default async function PlanningPage() {
  const [nwSummary, debts, cashFlowEntries, savingsGoals, financialGoals] = await Promise.all([
    getNetWorthSummary(),
    getDebtAccounts(),
    getCashFlowEntries(),
    getSavingsGoals(),
    getFinancialGoals(),
  ])

  const cashFlow = calculateCashFlowSummary(cashFlowEntries)
  const debtResult = calculatePayoff(debts, Math.max(0, cashFlow.monthlySurplus))
  const avalanche = debtResult.strategies.find((s) => s.strategy === 'avalanche')!
  const debtFreeDate = getDebtFreeDate(avalanche.months)

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Planning</h1>
      <p className="text-gray-400 mb-8">See where you&apos;re headed and set financial goals.</p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Current Net Worth</p>
          <p className={`text-2xl font-bold ${nwSummary.netWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(nwSummary.netWorth)}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Debt-Free Date</p>
          <p className="text-2xl font-bold text-white">
            {debts.length > 0 ? debtFreeDate : 'No debt'}
          </p>
          {debts.length > 0 && avalanche.months > 0 && (
            <p className="text-xs text-gray-500 mt-1">{formatMonths(avalanche.months)} remaining</p>
          )}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Monthly Surplus</p>
          <p className={`text-2xl font-bold ${cashFlow.monthlySurplus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(cashFlow.monthlySurplus)}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Active Goals</p>
          <p className="text-2xl font-bold text-white">{financialGoals.length}</p>
        </div>
      </div>

      {/* Projection charts */}
      <div className="mb-8">
        <ProjectionCharts
          currentNetWorth={nwSummary.netWorth}
          monthlySurplus={cashFlow.monthlySurplus}
          debts={debts}
          savingsGoals={savingsGoals}
        />
      </div>

      {/* Financial goals */}
      <GoalList goals={financialGoals} monthlySurplus={cashFlow.monthlySurplus} />
    </div>
  )
}
