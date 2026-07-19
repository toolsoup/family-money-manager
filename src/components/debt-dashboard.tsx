'use client'

import { useState, useMemo } from 'react'
import { calculatePayoff, type PayoffResult } from '@/lib/debt-calculator'
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
  avalanche: '#ef4444',
  snowball: '#3b82f6',
  hybrid: '#a855f7',
  highest_payment: '#f59e0b',
  custom: '#10b981',
  minimum_only: '#6b7280',
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
    <div className="space-y-8">
      {/* Extra payment input */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <label className="block text-sm text-gray-400 mb-2">
          Extra monthly payment toward debt
        </label>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-lg">$</span>
          <input
            type="number"
            min="0"
            step="50"
            value={extraPayment}
            onChange={(e) => setExtraPayment(Math.max(0, parseFloat(e.target.value) || 0))}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-lg w-40 focus:outline-none focus:border-blue-500"
          />
          <span className="text-gray-500 text-sm">/ month on top of minimums</span>
        </div>
      </div>

      {/* Debt summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm text-gray-400 mb-3">Your Debts</h3>
        <div className="divide-y divide-gray-800">
          {debts.map((d) => (
            <div key={d.id} className="flex items-center justify-between py-2">
              <span className="text-white text-sm">{d.name}</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">{formatPercent(d.interest_rate)} APR</span>
                <span className="text-gray-400">{formatCurrency(d.minimum_payment)}/mo min</span>
                <span className="text-red-400 font-medium">{formatCurrency(d.balance)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy comparison cards */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Strategy Comparison</h2>
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
                className={`text-left bg-gray-900 border rounded-xl p-5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 ring-1 ring-blue-500'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-medium text-sm">{s.label}</h3>
                  <div className="flex gap-1">
                    {isBestInterest && (
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                        Saves Most
                      </span>
                    )}
                    {isBestTime && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                        Fastest
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mb-3">{STRATEGY_DESCRIPTIONS[s.strategy]}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Debt free in</span>
                    <span className="text-white font-medium">{formatMonths(s.months)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total interest</span>
                    <span className="text-red-400">{formatCurrency(s.totalInterestPaid)}</span>
                  </div>
                  {s.strategy !== 'minimum_only' && interestSaved > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">You save</span>
                      <span className="text-green-400">
                        {formatCurrency(interestSaved)} &middot; {timeSaved} mo
                      </span>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Payoff timeline chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Payoff Timeline</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                tick={{ fontSize: 11 }}
                label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#6b7280', fontSize: 11 }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 11 }}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#9ca3af' }}
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
      </div>

      {/* Selected strategy payoff order */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Payoff Order — {selected.label}
        </h2>
        {selected.debtPayoffOrder.length === 0 ? (
          <p className="text-gray-500 text-sm">No payoff data available.</p>
        ) : (
          <div className="space-y-2">
            {selected.debtPayoffOrder.map((d, i) => (
              <div key={d.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-6">{i + 1}.</span>
                  <span className="text-white text-sm">{d.name}</span>
                </div>
                <span className="text-gray-400 text-sm">Paid off in {formatMonths(d.paidOffMonth)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom order editor */}
      {selectedStrategy === 'custom' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Custom Priority Order</h2>
          <p className="text-gray-500 text-xs mb-3">Use arrows to set which debt to pay off first.</p>
          <div className="space-y-1">
            {customOrder.map((id, i) => {
              const debt = debts.find((d) => d.id === id)
              if (!debt) return null
              return (
                <div key={id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-6">{i + 1}.</span>
                    <span className="text-white text-sm">{debt.name}</span>
                    <span className="text-gray-500 text-xs">{formatCurrency(debt.balance)}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveDebt(i, -1)}
                      disabled={i === 0}
                      className="text-gray-400 hover:text-white disabled:opacity-30 px-2 py-1 text-sm cursor-pointer"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveDebt(i, 1)}
                      disabled={i === customOrder.length - 1}
                      className="text-gray-400 hover:text-white disabled:opacity-30 px-2 py-1 text-sm cursor-pointer"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
