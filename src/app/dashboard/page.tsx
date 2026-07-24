import {
  getNetWorthSummary,
  getDebtAccounts,
  getCashFlowEntries,
  getSavingsGoals,
  getFinancialGoals,
  getDocuments,
} from '@/lib/queries'
import { calculateCashFlowSummary } from '@/lib/cash-flow-calculator'
import { calculatePayoff } from '@/lib/debt-calculator'
import { getDebtFreeDate } from '@/lib/projection-calculator'
import { formatCurrency, formatMonths, formatFileSize } from '@/lib/format'
import { DashboardOverview } from '@/components/dashboard-overview'
import Link from 'next/link'

export default async function DashboardPage() {
  const [nwSummary, debts, cashFlowEntries, savingsGoals, financialGoals, documents] =
    await Promise.all([
      getNetWorthSummary(),
      getDebtAccounts(),
      getCashFlowEntries(),
      getSavingsGoals(),
      getFinancialGoals(),
      getDocuments(),
    ])

  const cashFlow = calculateCashFlowSummary(cashFlowEntries)
  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0)
  const debtResult = calculatePayoff(debts, Math.max(0, cashFlow.monthlySurplus))
  const avalanche = debtResult.strategies.find((s) => s.strategy === 'avalanche')!
  const recentDocs = documents.slice(0, 3)
  const topGoals = savingsGoals.slice(0, 3)

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">Your complete financial overview.</p>

      {/* Key stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Net Worth</p>
          <p className={`text-2xl font-bold ${nwSummary.netWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(nwSummary.netWorth)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {formatCurrency(nwSummary.totalAssets)} assets · {formatCurrency(nwSummary.totalLiabilities)} liabilities
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Monthly Surplus</p>
          <p className={`text-2xl font-bold ${cashFlow.monthlySurplus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(cashFlow.monthlySurplus)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {formatCurrency(cashFlow.totalMonthlyIncome)} in · {formatCurrency(cashFlow.totalMonthlyExpenses)} out
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Total Debt</p>
          <p className="text-2xl font-bold text-red-400">
            {totalDebt > 0 ? formatCurrency(totalDebt) : '$0.00'}
          </p>
          {debts.length > 0 && avalanche.months > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              Debt-free: {getDebtFreeDate(avalanche.months)} ({formatMonths(avalanche.months)})
            </p>
          )}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Active Goals</p>
          <p className="text-2xl font-bold text-white">{financialGoals.length}</p>
          <p className="text-xs text-gray-600 mt-1">
            {savingsGoals.length} savings · {documents.length} docs
          </p>
        </div>
      </div>

      {/* Net Worth Projection Chart */}
      <div className="mb-8">
        <DashboardOverview
          currentNetWorth={nwSummary.netWorth}
          monthlySurplus={cashFlow.monthlySurplus}
        />
      </div>

      {/* Two-column grid: Cash Flow + Debt */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cash Flow Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Cash Flow</h2>
            <Link href="/dashboard/cash-flow" className="text-blue-400 hover:text-blue-300 text-xs">
              View details
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Income</span>
              <span className="text-green-400 font-medium">{formatCurrency(cashFlow.totalMonthlyIncome)}/mo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Expenses</span>
              <span className="text-red-400 font-medium">{formatCurrency(cashFlow.totalMonthlyExpenses)}/mo</span>
            </div>
            <div className="border-t border-gray-800 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Surplus</span>
                <span className={`font-bold ${cashFlow.monthlySurplus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(cashFlow.monthlySurplus)}/mo
                </span>
              </div>
            </div>
            {cashFlow.expenseBreakdown.length > 0 && (
              <div className="pt-2">
                <p className="text-gray-500 text-xs mb-2">Top expenses</p>
                {cashFlow.expenseBreakdown.slice(0, 3).map((cat) => (
                  <div key={cat.category} className="flex justify-between text-xs py-0.5">
                    <span className="text-gray-500">{cat.category}</span>
                    <span className="text-gray-400">{formatCurrency(cat.monthlyAmount)}/mo</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Debt Snapshot */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Debt Snapshot</h2>
            <Link href="/dashboard/debt-destroyer" className="text-blue-400 hover:text-blue-300 text-xs">
              View strategies
            </Link>
          </div>
          {debts.length === 0 ? (
            <p className="text-gray-500 text-sm">No debts tracked. You&apos;re debt free!</p>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Total Debt</span>
                <span className="text-red-400 font-bold">{formatCurrency(totalDebt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Debt-Free Date</span>
                <span className="text-white font-medium">{getDebtFreeDate(avalanche.months)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Interest Saved (Avalanche)</span>
                <span className="text-green-400 font-medium">
                  {formatCurrency(
                    (debtResult.strategies.find((s) => s.strategy === 'minimum_only')?.totalInterestPaid ?? 0)
                    - avalanche.totalInterestPaid
                  )}
                </span>
              </div>
              <div className="border-t border-gray-800 pt-3">
                <p className="text-gray-500 text-xs mb-2">Your debts</p>
                {debts.map((d) => (
                  <div key={d.id} className="flex justify-between text-xs py-0.5">
                    <span className="text-gray-500">{d.name}</span>
                    <span className="text-red-400">{formatCurrency(d.balance)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Two-column grid: Savings Goals + Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Savings Goals */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Savings Goals</h2>
            <Link href="/dashboard/cash-flow" className="text-blue-400 hover:text-blue-300 text-xs">
              View all
            </Link>
          </div>
          {topGoals.length === 0 ? (
            <p className="text-gray-500 text-sm">No savings goals set yet.</p>
          ) : (
            <div className="space-y-4">
              {topGoals.map((goal) => {
                const progress = goal.target_amount > 0
                  ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
                  : 0
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">{goal.name}</span>
                      <span className="text-gray-400">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-gray-600 text-xs mt-1">
                      {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Documents */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Documents</h2>
            <Link href="/dashboard/documents" className="text-blue-400 hover:text-blue-300 text-xs">
              View all
            </Link>
          </div>
          {recentDocs.length === 0 ? (
            <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-gray-500 text-xs bg-gray-800 px-2 py-0.5 rounded">{doc.category}</span>
                      <span className="text-gray-600 text-xs">{formatFileSize(doc.file_size)}</span>
                    </div>
                  </div>
                  <span className="text-gray-600 text-xs">
                    {new Date(doc.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/net-worth"
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Add Account
          </Link>
          <Link
            href="/dashboard/cash-flow"
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Add Income/Expense
          </Link>
          <Link
            href="/dashboard/documents"
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Upload Document
          </Link>
          <Link
            href="/dashboard/planning"
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Set a Goal
          </Link>
        </div>
      </div>
    </div>
  )
}
