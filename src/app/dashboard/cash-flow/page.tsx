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

  const figureStyle = {
    margin: '2px 0 0',
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    fontSize: '28px',
  } as const

  return (
    <div
      className="sheet"
      style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-8) var(--space-8)',
      }}
    >
      <h1 style={{ margin: '0 0 var(--space-2)' }}>Money in and out</h1>
      <p className="text-muted" style={{ margin: '0 0 var(--space-6)' }}>
        Track your income, expenses, and savings goals.
      </p>

      {/* Monthly summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
      >
        <div>
          <h6 className="text-muted" style={{ margin: 0 }}>Monthly income</h6>
          <p className="tnum amt-pos" style={figureStyle}>{formatCurrency(summary.totalMonthlyIncome)}</p>
        </div>
        <div>
          <h6 className="text-muted" style={{ margin: 0 }}>Monthly expenses</h6>
          <p className="tnum" style={figureStyle}>{formatCurrency(summary.totalMonthlyExpenses)}</p>
        </div>
        <div>
          <h6 className="text-muted" style={{ margin: 0 }}>Monthly {isSurplus ? 'surplus' : 'deficit'}</h6>
          <p className={`tnum ${isSurplus ? '' : 'amt-warn'}`} style={figureStyle}>
            {isSurplus
              ? formatCurrency(summary.monthlySurplus)
              : `−${formatCurrency(Math.abs(summary.monthlySurplus))}`}
          </p>
        </div>
      </div>

      <div className="flex flex-col" style={{ gap: 'var(--space-8)', marginTop: 'var(--space-8)' }}>
        <CashFlowList
          title="Income"
          entries={incomeEntries}
          monthlyTotal={summary.totalMonthlyIncome}
          defaultType="income"
        />

        <CashFlowList
          title="Expenses"
          entries={expenseEntries}
          monthlyTotal={summary.totalMonthlyExpenses}
          defaultType="expense"
        />

        <CategoryChart
          data={summary.expenseBreakdown}
          title="Expense breakdown"
        />

        <SavingsGoalsList
          goals={goals}
          monthlySurplus={summary.monthlySurplus}
        />
      </div>
    </div>
  )
}
