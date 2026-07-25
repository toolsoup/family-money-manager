import {
  getAccounts,
  getNetWorthSummary,
  getCashFlowEntries,
} from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'
import { calculateCashFlowSummary } from '@/lib/cash-flow-calculator'
import { formatCurrency } from '@/lib/format'
import { ACCOUNT_TYPE_LABELS, type Account, type CashFlowEntry } from '@/lib/types'
import Link from 'next/link'

// ── small Phosphor duotone icons, keyed off account type ──────────────────
function AccountIcon({ type }: { type: Account['type'] }) {
  const common = { viewBox: '0 0 256 256', width: 20, height: 20, fill: 'currentColor', 'aria-hidden': true } as const
  switch (type) {
    case 'property':
    case 'mortgage':
    case 'line_of_credit':
      return (
        <svg {...common}>
          <path d="M216,120v96H152V152H104v64H40V120a8,8,0,0,1,2.34-5.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,216,120Z" opacity="0.25" />
          <path d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z" />
        </svg>
      )
    case 'investment':
      return (
        <svg {...common}>
          <path d="M232,56v64L168,56Z" opacity="0.25" />
          <path d="M232,48H168a8,8,0,0,0-5.66,13.66L188.69,88,136,140.69l-34.34-34.35a8,8,0,0,0-11.32,0l-72,72a8,8,0,0,0,11.32,11.32L96,123.31l34.34,34.35a8,8,0,0,0,11.32,0L200,99.31l26.34,26.35A8,8,0,0,0,240,120V56A8,8,0,0,0,232,48Zm-8,52.69L187.31,64H224Z" />
        </svg>
      )
    case 'credit_card':
      return (
        <svg {...common}>
          <path d="M232,96v96a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V96Z" opacity="0.25" />
          <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V88H32V64Zm0,128H32V104H224v88Zm-16-24a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h32A8,8,0,0,1,208,168Zm-64,0a8,8,0,0,1-8,8H120a8,8,0,0,1,0-16h16A8,8,0,0,1,144,168Z" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M232,96H24L128,32Z" opacity="0.25" />
          <path d="M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z" />
        </svg>
      )
  }
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const fullName: string | undefined =
    user?.user_metadata?.full_name || user?.user_metadata?.name
  const firstName = fullName ? fullName.split(' ')[0] : null

  const [accounts, nwSummary, cashFlowEntries] = await Promise.all([
    getAccounts(),
    getNetWorthSummary(),
    getCashFlowEntries(),
  ])

  const cashFlow = calculateCashFlowSummary(cashFlowEntries)

  const totalExpenses = cashFlow.totalMonthlyExpenses
  const topCategories = cashFlow.expenseBreakdown.slice(0, 5)
  const restTotal = cashFlow.expenseBreakdown.slice(5).reduce((s, c) => s + c.monthlyAmount, 0)
  const pct = (n: number) => (totalExpenses > 0 ? Math.round((n / totalExpenses) * 100) : 0)

  const recent = [...cashFlowEntries]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12)

  const dateLine = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const signedAmount = (e: CashFlowEntry) =>
    e.type === 'income' ? formatCurrency(e.amount) : `−${formatCurrency(e.amount)}`

  // assets vs liabilities split for the net-worth hero bar
  const gross = nwSummary.totalAssets + nwSummary.totalLiabilities
  const assetShare = gross > 0 ? (nwSummary.totalAssets / gross) * 100 : 100

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Greeting + primary action */}
      <div className="flex" style={{ alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div>
          <h6 style={{ margin: '0 0 var(--space-2)' }}>{dateLine}</h6>
          <h1 style={{ margin: 0, fontSize: '40px' }}>
            {greeting()}{firstName ? `, ${firstName}` : ''}
          </h1>
        </div>
        <Link href="/dashboard/cash-flow" className="btn btn-primary" style={{ padding: '11px 18px' }}>
          <svg viewBox="0 0 256 256" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
          </svg>
          Add money in or out
        </Link>
      </div>

      {/* Net worth hero */}
      <div
        className="card"
        style={{
          padding: 'var(--space-6)',
          borderColor: 'var(--color-accent-300)',
          background:
            'radial-gradient(600px 200px at 100% 0%, rgba(245,166,35,0.10), transparent 70%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 40%), var(--color-surface)',
        }}
      >
        <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div>
            <span className="badge">Net worth</span>
            <p className="tnum" style={{ margin: '8px 0 6px', fontSize: '52px', lineHeight: 1, fontWeight: 700, color: nwSummary.netWorth < 0 ? 'var(--color-negative)' : 'var(--color-text)' }}>
              {nwSummary.netWorth < 0 ? `−${formatCurrency(Math.abs(nwSummary.netWorth))}` : formatCurrency(nwSummary.netWorth)}
            </p>
            <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>
              <span className="tnum" style={{ color: 'var(--color-positive)' }}>{formatCurrency(nwSummary.totalAssets)}</span> owned
              <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
              <span className="tnum" style={{ color: 'var(--color-negative)' }}>{formatCurrency(nwSummary.totalLiabilities)}</span> owed
            </p>
          </div>
          <div style={{ minWidth: '220px', flex: '1 1 220px', maxWidth: '360px' }}>
            <div style={{ display: 'flex', height: '10px', borderRadius: '999px', overflow: 'hidden', background: 'var(--color-neutral-200)' }}>
              <span style={{ width: `${assetShare}%`, background: 'var(--color-positive)' }} />
              <span style={{ width: `${100 - assetShare}%`, background: 'var(--color-negative)' }} />
            </div>
            <div className="flex" style={{ justifyContent: 'space-between', marginTop: '8px', fontSize: '12px' }}>
              <span className="text-muted">Assets</span>
              <span className="text-muted">Liabilities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balances */}
      <section>
        <h6 style={{ margin: '0 0 var(--space-3)' }}>Balances</h6>
        {accounts.length === 0 ? (
          <p className="text-muted">
            No accounts yet. <Link href="/dashboard/net-worth">Add what you own and owe</Link> to see your balances here.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            {accounts.slice(0, 12).map((a) => (
              <div key={a.id} className="card">
                <div className="flex items-center" style={{ gap: '10px' }}>
                  <span
                    className="flex items-center justify-center"
                    style={{ width: '36px', height: '36px', flex: 'none', borderRadius: '10px', background: 'var(--color-accent-100)', color: 'var(--color-accent)' }}
                  >
                    <AccountIcon type={a.type} />
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-dim)' }}>{a.name}</span>
                </div>
                <p className="tnum" style={{ margin: '4px 0 2px', fontWeight: 700, fontSize: '26px', color: a.is_asset ? 'var(--color-text)' : 'var(--color-negative)' }}>
                  {a.is_asset ? formatCurrency(a.balance) : `−${formatCurrency(a.balance)}`}
                </p>
                <p className="text-muted" style={{ margin: 0, fontSize: '12.5px' }}>{a.institution || ACCOUNT_TYPE_LABELS[a.type]}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Spending + recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr)', gap: 'var(--space-4)', alignItems: 'start' }}>
        {/* Spending by category */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>Spending by category</h3>
            <span className="text-muted tnum" style={{ fontSize: '14px' }}>{formatCurrency(totalExpenses)}/mo</span>
          </div>
          {topCategories.length === 0 ? (
            <p className="text-muted" style={{ margin: 0 }}>
              No expenses tracked yet. <Link href="/dashboard/cash-flow">Add your monthly costs</Link>.
            </p>
          ) : (
            <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
              {topCategories.map((cat, i) => (
                <div key={cat.category}>
                  <p style={{ margin: '0 0 7px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '14px' }}>
                    <span>{cat.category}</span>
                    <span className="tnum">{formatCurrency(cat.monthlyAmount)} · {pct(cat.monthlyAmount)}%</span>
                  </p>
                  <div className="meter"><i className={i === 0 ? '' : 'mute'} style={{ width: `${pct(cat.monthlyAmount)}%` }} /></div>
                </div>
              ))}
              {restTotal > 0 && (
                <p className="text-muted" style={{ margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '14px' }}>
                  <span>Everything else</span>
                  <span className="tnum">{formatCurrency(restTotal)} · {pct(restTotal)}%</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Recent cash flow */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-3)' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>Recent cash flow</h3>
            <Link href="/dashboard/cash-flow" className="btn btn-ghost">See all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-muted" style={{ margin: 0 }}>Nothing logged yet.</p>
          ) : (
            <div style={{ maxHeight: '440px', overflowY: 'auto', margin: '0 calc(-1 * var(--space-3))' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Added</th>
                    <th>What</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((e) => (
                    <tr key={e.id}>
                      <td className="tnum text-muted">
                        {new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{e.name}</span><br />
                        <span className="text-muted" style={{ fontSize: '12.5px', textTransform: 'capitalize' }}>{e.frequency}</span>
                      </td>
                      <td><span className={`tag ${e.type === 'income' ? 'tag-accent' : 'tag-neutral'}`}>{e.category}</span></td>
                      <td className={`tnum ${e.type === 'income' ? 'amt-pos' : ''}`} style={{ textAlign: 'right', fontWeight: 600 }}>
                        {signedAmount(e)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
