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
    <div>
      <h3 style={{ margin: '0 0 var(--space-1)' }}>Net Worth Projection</h3>
      <p className="text-muted" style={{ margin: '0 0 var(--space-4)', fontSize: '13px' }}>
        12-month outlook based on current surplus
      </p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="dashNwGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0088b0" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0088b0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              stroke="#605d5d"
              tick={{ fontSize: 10, fill: '#605d5d' }}
              interval={1}
            />
            <YAxis
              stroke="#605d5d"
              tick={{ fontSize: 10, fill: '#605d5d' }}
              tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
              width={50}
            />
            <Tooltip
              contentStyle={{ background: '#f3f2f2', border: '1px solid #d7d3d3', borderRadius: 2, color: '#201e1d', fontFamily: 'var(--font-body)' }}
              labelStyle={{ color: '#605d5d' }}
              formatter={(value) => [formatCurrency(Number(value)), 'Net Worth']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0088b0"
              strokeWidth={2}
              fill="url(#dashNwGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
