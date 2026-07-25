'use client'

import { useState, useMemo } from 'react'
import {
  AreaChart, Area,
  LineChart, Line,
  XAxis, YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import { formatCurrency } from '@/lib/format'
import {
  projectNetWorth,
  projectDebtPayoff,
  projectSavingsGoals,
} from '@/lib/projection-calculator'
import type { DebtAccount, SavingsGoal, ProjectionTimeframe } from '@/lib/types'

const TIMEFRAME_LABELS: Record<ProjectionTimeframe, string> = {
  1: '1 Year',
  3: '3 Years',
  5: '5 Years',
  10: '10 Years',
}

// Midnight Gold palette — gold leads, distinct hues for the goal lines.
const GOAL_COLORS = [
  '#f5a623', '#34d399', '#60a5fa', '#a78bfa',
  '#22d3ee', '#fb7185', '#facc15', '#f472b6',
]

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#1c1f28',
    border: '1px solid #2a3040',
    borderRadius: 2,
    color: '#f4f5f7',
    fontFamily: 'var(--font-body)',
  },
  labelStyle: { color: '#9aa1ae' },
}

interface Props {
  currentNetWorth: number
  monthlySurplus: number
  debts: DebtAccount[]
  savingsGoals: SavingsGoal[]
}

export function ProjectionCharts({ currentNetWorth, monthlySurplus, debts, savingsGoals }: Props) {
  const [timeframe, setTimeframe] = useState<ProjectionTimeframe>(5)
  const months = timeframe * 12

  const netWorthData = useMemo(
    () => projectNetWorth(currentNetWorth, monthlySurplus, months),
    [currentNetWorth, monthlySurplus, months],
  )

  const debtResult = useMemo(
    () => projectDebtPayoff(debts, Math.max(0, monthlySurplus), months),
    [debts, monthlySurplus, months],
  )

  const savingsResult = useMemo(
    () => projectSavingsGoals(savingsGoals, Math.max(0, monthlySurplus), months),
    [savingsGoals, monthlySurplus, months],
  )

  // Compute tick interval for X axis labels
  const tickInterval = months <= 12 ? 1 : months <= 36 ? 3 : months <= 60 ? 6 : 12

  return (
    <div className="space-y-8">
      {/* Timeframe toggle */}
      <div className="seg">
        {([1, 3, 5, 10] as ProjectionTimeframe[]).map((t) => (
          <label key={t} className="seg-opt">
            <input
              type="radio"
              name="projection-timeframe"
              checked={timeframe === t}
              onChange={() => setTimeframe(t)}
            />
            {TIMEFRAME_LABELS[t]}
          </label>
        ))}
      </div>

      {/* Net Worth Growth */}
      <section>
        <h3 style={{ margin: '0 0 var(--space-1)' }}>Net Worth Projection</h3>
        <p className="text-muted" style={{ margin: '0 0 var(--space-4)', fontSize: '13px' }}>
          Based on {formatCurrency(monthlySurplus)}/mo surplus accumulating over time
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={netWorthData}>
              <defs>
                <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5a623" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f5a623" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                stroke="#9aa1ae"
                tick={{ fontSize: 11 }}
                interval={tickInterval - 1}
              />
              <YAxis
                stroke="#9aa1ae"
                tick={{ fontSize: 11 }}
                tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(value) => [formatCurrency(Number(value)), 'Net Worth']}
              />
              <ReferenceLine y={0} stroke="#3a4150" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#f5a623"
                strokeWidth={2}
                fill="url(#netWorthGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Debt Payoff Timeline */}
      {debts.length > 0 && (
        <section>
          <h3 style={{ margin: '0 0 var(--space-1)' }}>Debt Payoff Timeline</h3>
          <p className="text-muted" style={{ margin: '0 0 var(--space-4)', fontSize: '13px' }}>
            Avalanche strategy with {formatCurrency(Math.max(0, monthlySurplus))}/mo extra payments
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={debtResult.data}>
                <defs>
                  <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="#9aa1ae"
                  tick={{ fontSize: 11 }}
                  interval={tickInterval - 1}
                />
                <YAxis
                  stroke="#9aa1ae"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={(value) => [formatCurrency(Number(value)), 'Remaining Debt']}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#fb7185"
                  strokeWidth={2}
                  fill="url(#debtGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Savings Goal Projections */}
      {savingsResult.goalNames.length > 0 && (
        <section>
          <h3 style={{ margin: '0 0 var(--space-1)' }}>Savings Goal Projections</h3>
          <p className="text-muted" style={{ margin: '0 0 var(--space-4)', fontSize: '13px' }}>
            Surplus split equally across {savingsResult.goalNames.length} active goal{savingsResult.goalNames.length > 1 ? 's' : ''}
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsResult.data}>
                <XAxis
                  dataKey="label"
                  stroke="#9aa1ae"
                  tick={{ fontSize: 11 }}
                  interval={tickInterval - 1}
                />
                <YAxis
                  stroke="#9aa1ae"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
                />
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={(value, name) => [formatCurrency(Number(value)), String(name)]}
                />
                <Legend wrapperStyle={{ color: '#f4f5f7', fontSize: 13 }} />
                {savingsResult.goalNames.map((name, i) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={GOAL_COLORS[i % GOAL_COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  )
}
