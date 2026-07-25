import { getDebtAccounts } from '@/lib/queries'
import { formatCurrency } from '@/lib/format'
import { DebtDashboard } from '@/components/debt-dashboard'
import Link from 'next/link'

export default async function DebtDestroyerPage() {
  const debts = await getDebtAccounts()

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0)
  const totalMinPayments = debts.reduce((sum, d) => sum + d.minimum_payment, 0)

  if (debts.length === 0) {
    return (
      <div
        className="sheet"
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          padding: 'var(--space-6) var(--space-8) var(--space-8)',
        }}
      >
        <h1 style={{ margin: '0 0 var(--space-2)' }}>Debt Destroyer</h1>
        <p className="text-muted" style={{ margin: '0 0 var(--space-8)' }}>
          Crush your debt with the right strategy.
        </p>

        <section
          style={{
            marginTop: 'var(--space-8)',
            textAlign: 'center',
            maxWidth: '32rem',
            marginInline: 'auto',
          }}
        >
          <p style={{ fontSize: '40px', margin: '0 0 var(--space-3)' }}>⚡</p>
          <h3 style={{ margin: '0 0 var(--space-2)' }}>No debts to destroy yet</h3>
          <p className="text-muted" style={{ margin: '0 0 var(--space-4)' }}>
            Add liability accounts (credit cards, mortgages) with interest rates and minimum payments
            in the Net Worth section to unlock debt payoff strategies.
          </p>
          <Link href="/dashboard/net-worth" className="btn btn-primary">
            Go to Net Worth
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div
      className="sheet"
      style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-8) var(--space-8)',
      }}
    >
      <h1 style={{ margin: '0 0 var(--space-2)' }}>Debt Destroyer</h1>
      <p className="text-muted" style={{ margin: '0 0 var(--space-6)' }}>
        Crush your debt with the right strategy.
      </p>

      {/* Summary figures */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
      >
        <div>
          <h6 className="text-muted" style={{ margin: '0 0 var(--space-2)' }}>Total debt</h6>
          <p
            className="tnum"
            style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '28px' }}
          >
            −{formatCurrency(totalDebt)}
          </p>
        </div>
        <div>
          <h6 className="text-muted" style={{ margin: '0 0 var(--space-2)' }}>Debts</h6>
          <p
            className="tnum"
            style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '28px' }}
          >
            {debts.length}
          </p>
        </div>
        <div>
          <h6 className="text-muted" style={{ margin: '0 0 var(--space-2)' }}>Total minimum payments</h6>
          <p
            className="tnum"
            style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '28px' }}
          >
            {formatCurrency(totalMinPayments)}
            <span className="text-muted" style={{ fontSize: '15px', fontWeight: 400 }}>/mo</span>
          </p>
        </div>
      </div>

      <DebtDashboard debts={debts} />
    </div>
  )
}
