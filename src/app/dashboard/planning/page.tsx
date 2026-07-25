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

  const figureStyle = { margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '28px' } as const

  return (
    <div
      className="sheet"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-8) var(--space-8)',
      }}
    >
      <h1 style={{ margin: '0 0 var(--space-2)' }}>Planning</h1>
      <p className="text-muted" style={{ margin: '0 0 var(--space-8)', maxWidth: '40rem' }}>
        See where you&apos;re headed and set financial goals.
      </p>

      {/* Big-picture figures */}
      <section>
        <h6 style={{ margin: '0 0 var(--space-3)' }}>Where you stand</h6>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--space-6)',
            alignItems: 'start',
          }}
        >
          <div>
            <p className="text-muted" style={{ margin: '0 0 6px', fontSize: '13px' }}>Current net worth</p>
            <p className={`tnum ${nwSummary.netWorth < 0 ? 'amt-warn' : ''}`} style={figureStyle}>
              {nwSummary.netWorth < 0
                ? `−${formatCurrency(Math.abs(nwSummary.netWorth))}`
                : formatCurrency(nwSummary.netWorth)}
            </p>
          </div>
          <div>
            <p className="text-muted" style={{ margin: '0 0 6px', fontSize: '13px' }}>Debt-free date</p>
            <p style={figureStyle}>{debts.length > 0 ? debtFreeDate : 'No debt'}</p>
            {debts.length > 0 && avalanche.months > 0 && (
              <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '13px' }}>
                {formatMonths(avalanche.months)} remaining
              </p>
            )}
          </div>
          <div>
            <p className="text-muted" style={{ margin: '0 0 6px', fontSize: '13px' }}>Monthly surplus</p>
            <p
              className={`tnum ${cashFlow.monthlySurplus >= 0 ? 'amt-pos' : 'amt-warn'}`}
              style={figureStyle}
            >
              {cashFlow.monthlySurplus >= 0
                ? formatCurrency(cashFlow.monthlySurplus)
                : `−${formatCurrency(Math.abs(cashFlow.monthlySurplus))}`}
            </p>
          </div>
          <div>
            <p className="text-muted" style={{ margin: '0 0 6px', fontSize: '13px' }}>Active goals</p>
            <p className="tnum" style={figureStyle}>{financialGoals.length}</p>
          </div>
        </div>
      </section>

      {/* Projection charts */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <ProjectionCharts
          currentNetWorth={nwSummary.netWorth}
          monthlySurplus={cashFlow.monthlySurplus}
          debts={debts}
          savingsGoals={savingsGoals}
        />
      </section>

      {/* Financial goals */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <GoalList goals={financialGoals} monthlySurplus={cashFlow.monthlySurplus} />
      </section>
    </div>
  )
}
