'use client'

import {
  AreaChart, Area,
  XAxis, YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/format'
import { projectNetWorth } from '@/lib/projection-calculator'

interface Props {
  currentNetWorth: number
  monthlySurplus: number
}

export function DashboardOverview({ currentNetWorth, monthlySurplus }: Props) {
  const data = projectNetWorth(currentNetWorth, monthlySurplus, 12)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-1">Net Worth Projection</h2>
      <p className="text-xs text-gray-500 mb-4">12-month outlook based on current surplus</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="dashNwGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              stroke="#6b7280"
              tick={{ fontSize: 10 }}
              interval={1}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 10 }}
              tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
              width={50}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(value) => [formatCurrency(Number(value)), 'Net Worth']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#dashNwGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
