import { getCashFlowEntries, getSavingsGoals } from '@/lib/queries'
import { calculateCashFlowSummary } from '@/lib/cash-flow-calculator'
import { formatCurrency } from '@/lib/format'
import { CashFlowList } from '@/components/cash-flow-list'
import { CategoryChart } from '@/components/category-chart'
import { SavingsGoalsList } from '@/components/savings-goals-list'

export default async function CashFlowPage() {
  const [entries, goals] = await Promise.all([getCashFlowEntries(), getSavingsGoals()])

  const incomeEntries = entries.filter((e) => e.type === 'income')
  const expenseEntries = entries.filter((e) => e.type === 'expense')

  const summary = calculateCashFlowSummary(entries)
  const isSurplus = summary.monthlySurplus >= 0

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Cash Flow</h1>
      <p className="text-gray-400 mb-8">Track your income, expenses, and savings goals.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Monthly Income</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(summary.totalMonthlyIncome)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Monthly Expenses</p>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(summary.totalMonthlyExpenses)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Monthly {isSurplus ? 'Surplus' : 'Deficit'}</p>
          <p className={`text-2xl font-bold ${isSurplus ? 'text-white' : 'text-red-400'}`}>
            {formatCurrency(summary.monthlySurplus)}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <CashFlowList
          title="Income"
          entries={incomeEntries}
          monthlyTotal={summary.totalMonthlyIncome}
          colorClass="text-green-400"
          defaultType="income"
        />

        <CashFlowList
          title="Expenses"
          entries={expenseEntries}
          monthlyTotal={summary.totalMonthlyExpenses}
          colorClass="text-red-400"
          defaultType="expense"
        />

        <CategoryChart
          data={summary.expenseBreakdown}
          title="Expense Breakdown"
        />

        <SavingsGoalsList
          goals={goals}
          monthlySurplus={summary.monthlySurplus}
        />
      </div>
    </div>
  )
}
