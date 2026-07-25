'use client'

import { useState, useMemo } from 'react'
import { calculatePayoff } from '@/lib/debt-calculator'
import { formatCurrency, formatMonths, formatPercent } from '@/lib/format'
import type { DebtAccount, PayoffStrategyType } from '@/lib/types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const STRATEGY_COLORS: Record<PayoffStrategyType, string> = {
  avalanche: '#f5a623',
  snowball: '#fb7185',
  hybrid: '#34d399',
  highest_payment: '#9aa1ae',
  custom: '#94a3b8',
  minimum_only: '#3a4150',
}

const STRATEGY_DESCRIPTIONS: Record<PayoffStrategyType, string> = {
  avalanche: 'Pay highest interest rate first',
  snowball: 'Pay smallest balance first',
  hybrid: 'Balance weighted by rate',
  highest_payment: 'Pay largest minimum first',
  custom: 'Your custom priority order',
  minimum_only: 'Minimum payments only',
}

interface Props {
  debts: DebtAccount[]
}

export function DebtDashboard({ debts }: Props) {
  const [extraPayment, setExtraPayment] = useState(0)
  const [customOrder, setCustomOrder] = useState<string[]>(debts.map((d) => d.id))
  const [selectedStrategy, setSelectedStrategy] = useState<PayoffStrategyType>('avalanche')

  const result = useMemo(
    () => calculatePayoff(debts, extraPayment, customOrder),
    [debts, extraPayment, customOrder],
  )

  const minimumOnly = result.strategies.find((s) => s.strategy === 'minimum_only')!
  const selected = result.strategies.find((s) => s.strategy === selectedStrategy)!

  // Build chart data
  const maxMonths = Math.max(...result.strategies.map((s) => s.months))
  const chartData = useMemo(() => {
    const data: Record<string, number | string>[] = []
    for (let i = 0; i <= Math.min(maxMonths, 360); i++) {
      const point: Record<string, number | string> = { month: i }
      for (const s of result.strategies) {
        point[s.strategy] = s.monthlyBalances[i] ?? 0
      }
      data.push(point)
    }
    return data
  }, [result, maxMonths])

  function moveDebt(index: number, direction: -1 | 1) {
    const newOrder = [...customOrder]
    const swapIndex = index + direction
    if (swapIndex < 0 || swapIndex >= newOrder.length) return
    ;[newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]]
    setCustomOrder(newOrder)
  }

  return (
    <div>
      {/* Extra payment input */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <div className="field">
          <label htmlFor="extra-payment">Extra monthly payment toward debt</label>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
          <span className="text-muted" style={{ fontSize: '18px' }}>$</span>
          <input
            id="extra-payment"
            type="number"
            min="0"
            step="50"
            value={extraPayment}
            onChange={(e) => setExtraPayment(Math.max(0, parseFloat(e.target.value) || 0))}
            className="input tnum"
            style={{ width: '160px', fontSize: '18px' }}
          />
          <span className="text-muted" style={{ fontSize: '14px' }}>/ month on top of minimums</span>
        </div>
      </section>

      {/* Debt summary */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <h3 style={{ margin: '0 0 var(--space-3)' }}>Your Debts</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Debt</th>
              <th style={{ textAlign: 'right' }}>APR</th>
              <th style={{ textAlign: 'right' }}>Minimum</th>
              <th style={{ textAlign: 'right' }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {debts.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td className="tnum text-muted" style={{ textAlign: 'right' }}>{formatPercent(d.interest_rate)}</td>
                <td className="tnum text-muted" style={{ textAlign: 'right' }}>{formatCurrency(d.minimum_payment)}/mo</td>
                <td className="tnum" style={{ textAlign: 'right' }}>−{formatCurrency(d.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Strategy comparison cards */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <h3 style={{ margin: '0 0 var(--space-3)' }}>Strategy Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.strategies.map((s) => {
            const isBestInterest = s.strategy === result.bestForInterest
            const isBestTime = s.strategy === result.bestForTime
            const isSelected = s.strategy === selectedStrategy
            const interestSaved = minimumOnly.totalInterestPaid - s.totalInterestPaid
            const timeSaved = minimumOnly.months - s.months

            return (
              <button
                key={s.strategy}
                onClick={() => setSelectedStrategy(s.strategy)}
                className="card"
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: isSelected
                    ? '1px solid var(--color-accent)'
                    : '1px solid transparent',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                }}
              >
                <div className="flex items-center justify-between" style={{ gap: 'var(--space-2)' }}>
                  <h5 style={{ margin: 0 }}>{s.label}</h5>
                  <div className="flex" style={{ gap: '4px' }}>
                    {isBestInterest && <span className="tag tag-accent">Saves Most</span>}
                    {isBestTime && <span className="tag tag-neutral">Fastest</span>}
                  </div>
                </div>
                <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>
                  {STRATEGY_DESCRIPTIONS[s.strategy]}
                </p>
                <div className="flex flex-col" style={{ gap: '4px', fontSize: '14px' }}>
                  <div className="flex justify-between">
                    <span className="text-muted">Debt free in</span>
                    <span className="tnum">{formatMonths(s.months)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Total interest</span>
                    <span className="tnum">{formatCurrency(s.totalInterestPaid)}</span>
                  </div>
                  {s.strategy !== 'minimum_only' && interestSaved > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted">You save</span>
                      <span className="tnum amt-pos">
                        {formatCurrency(interestSaved)} &middot; {timeSaved} mo
                      </span>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Payoff timeline chart */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <h3 style={{ margin: '0 0 var(--space-3)' }}>Payoff Timeline</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="month"
                stroke="#9aa1ae"
                tick={{ fontSize: 11, fill: '#9aa1ae' }}
                label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#9aa1ae', fontSize: 11 }}
              />
              <YAxis
                stroke="#9aa1ae"
                tick={{ fontSize: 11, fill: '#9aa1ae' }}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ background: '#1c1f28', border: '1px solid #2a3040', color: '#f4f5f7', fontFamily: 'var(--font-body)' }}
                labelStyle={{ color: '#9aa1ae' }}
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  result.strategies.find((s) => s.strategy === name)?.label ?? String(name),
                ]}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Legend
                formatter={(value: string) =>
                  result.strategies.find((s) => s.strategy === value)?.label ?? value
                }
              />
              {result.strategies.map((s) => (
                <Line
                  key={s.strategy}
                  type="monotone"
                  dataKey={s.strategy}
                  stroke={STRATEGY_COLORS[s.strategy]}
                  strokeWidth={s.strategy === selectedStrategy ? 3 : 1}
                  dot={false}
                  opacity={s.strategy === selectedStrategy ? 1 : 0.4}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Selected strategy payoff order */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <h3 style={{ margin: '0 0 var(--space-3)' }}>
          Payoff Order — {selected.label}
        </h3>
        {selected.debtPayoffOrder.length === 0 ? (
          <p className="text-muted">No payoff data available.</p>
        ) : (
          <div>
            {selected.debtPayoffOrder.map((d, i) => (
              <div
                key={d.id}
                className="flex items-center justify-between"
                style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-divider)' }}
              >
                <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                  <span className="tnum text-muted" style={{ width: '24px', fontSize: '14px' }}>{i + 1}.</span>
                  <span style={{ fontSize: '14px' }}>{d.name}</span>
                </div>
                <span className="text-muted" style={{ fontSize: '14px' }}>Paid off in {formatMonths(d.paidOffMonth)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Custom order editor */}
      {selectedStrategy === 'custom' && (
        <section style={{ marginTop: 'var(--space-8)' }}>
          <h3 style={{ margin: '0 0 var(--space-2)' }}>Custom Priority Order</h3>
          <p className="text-muted" style={{ margin: '0 0 var(--space-3)', fontSize: '13px' }}>
            Use arrows to set which debt to pay off first.
          </p>
          <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
            {customOrder.map((id, i) => {
              const debt = debts.find((d) => d.id === id)
              if (!debt) return null
              return (
                <div
                  key={id}
                  className="flex items-center justify-between"
                  style={{
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px var(--space-3)',
                  }}
                >
                  <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                    <span className="tnum text-muted" style={{ width: '24px', fontSize: '14px' }}>{i + 1}.</span>
                    <span style={{ fontSize: '14px' }}>{debt.name}</span>
                    <span className="tnum text-muted" style={{ fontSize: '13px' }}>{formatCurrency(debt.balance)}</span>
                  </div>
                  <div className="flex" style={{ gap: '4px' }}>
                    <button
                      onClick={() => moveDebt(i, -1)}
                      disabled={i === 0}
                      className="btn btn-secondary btn-icon"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveDebt(i, 1)}
                      disabled={i === customOrder.length - 1}
                      className="btn btn-secondary btn-icon"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
