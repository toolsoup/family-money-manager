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

const GOAL_COLORS = [
  '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444',
  '#ec4899', '#06b6d4', '#f97316',
]

const TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 },
  labelStyle: { color: '#9ca3af' },
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
    <div className="space-y-6">
      {/* Timeframe toggle */}
      <div className="flex gap-2">
        {([1, 3, 5, 10] as ProjectionTimeframe[]).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              timeframe === t
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {TIMEFRAME_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Net Worth Growth */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-1">Net Worth Projection</h2>
        <p className="text-xs text-gray-500 mb-4">
          Based on {formatCurrency(monthlySurplus)}/mo surplus accumulating over time
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={netWorthData}>
              <defs>
                <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                stroke="#6b7280"
                tick={{ fontSize: 11 }}
                interval={tickInterval - 1}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 11 }}
                tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(value) => [formatCurrency(Number(value)), 'Net Worth']}
              />
              <ReferenceLine y={0} stroke="#374151" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#netWorthGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Debt Payoff Timeline */}
      {debts.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-1">Debt Payoff Timeline</h2>
          <p className="text-xs text-gray-500 mb-4">
            Avalanche strategy with {formatCurrency(Math.max(0, monthlySurplus))}/mo extra payments
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={debtResult.data}>
                <defs>
                  <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="#6b7280"
                  tick={{ fontSize: 11 }}
                  interval={tickInterval - 1}
                />
                <YAxis
                  stroke="#6b7280"
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
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#debtGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Savings Goal Projections */}
      {savingsResult.goalNames.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-1">Savings Goal Projections</h2>
          <p className="text-xs text-gray-500 mb-4">
            Surplus split equally across {savingsResult.goalNames.length} active goal{savingsResult.goalNames.length > 1 ? 's' : ''}
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsResult.data}>
                <XAxis
                  dataKey="label"
                  stroke="#6b7280"
                  tick={{ fontSize: 11 }}
                  interval={tickInterval - 1}
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
                />
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={(value, name) => [formatCurrency(Number(value)), String(name)]}
                />
                <Legend />
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
        </div>
      )}
    </div>
  )
}
