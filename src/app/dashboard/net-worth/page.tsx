import { getAccounts } from '@/lib/queries'
import { formatCurrency } from '@/lib/format'
import { AccountList } from '@/components/account-list'

export default async function NetWorthPage() {
  const accounts = await getAccounts()

  const assets = accounts.filter((a) => a.is_asset)
  const liabilities = accounts.filter((a) => !a.is_asset)

  const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0)
  const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0)
  const netWorth = totalAssets - totalLiabilities

  return (
    <div
      className="sheet"
      style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-8) var(--space-8)',
      }}
    >
      <h1 style={{ margin: '0 0 var(--space-2)' }}>Net Worth</h1>
      <p className="text-muted" style={{ margin: '0 0 var(--space-8)' }}>
        Track your assets and liabilities.
      </p>

      {/* Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        <div>
          <h6 className="text-muted" style={{ margin: '0 0 var(--space-2)' }}>Total Assets</h6>
          <p
            className="tnum"
            style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '28px' }}
          >
            {formatCurrency(totalAssets)}
          </p>
        </div>
        <div>
          <h6 className="text-muted" style={{ margin: '0 0 var(--space-2)' }}>Total Liabilities</h6>
          <p
            className="tnum"
            style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '28px' }}
          >
            {formatCurrency(totalLiabilities)}
          </p>
        </div>
        <div>
          <h6 className="text-muted" style={{ margin: '0 0 var(--space-2)' }}>Net Worth</h6>
          <p
            className="tnum"
            style={{
              margin: 0,
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '28px',
              color: netWorth < 0 ? 'var(--color-accent-2-700)' : 'var(--color-text)',
            }}
          >
            {netWorth < 0 ? `−${formatCurrency(Math.abs(netWorth))}` : formatCurrency(netWorth)}
          </p>
        </div>
      </div>

      <section style={{ marginTop: 'var(--space-8)' }}>
        <AccountList
          title="Assets"
          accounts={assets}
          total={totalAssets}
          defaultType="checking"
        />
      </section>

      <section style={{ marginTop: 'var(--space-8)' }}>
        <AccountList
          title="Liabilities"
          accounts={liabilities}
          total={totalLiabilities}
          defaultType="credit_card"
        />
      </section>
    </div>
  )
}
