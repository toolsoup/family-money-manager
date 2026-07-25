'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/format'
import type { CategoryBreakdown } from '@/lib/cash-flow-calculator'

// Midnight Gold categorical palette — gold-led, distinct hues, all readable on dark.
const COLORS = [
  '#f5a623', '#34d399', '#60a5fa', '#fb7185', '#a78bfa',
  '#22d3ee', '#f472b6', '#facc15', '#4ade80', '#93c5fd',
  '#fca5a5', '#c4b5fd', '#5eead4', '#fbbf24',
]

interface Props {
  data: CategoryBreakdown[]
  title: string
}

export function CategoryChart({ data, title }: Props) {
  if (data.length === 0) return null

  const chartData = data.map((d) => ({ name: d.category, value: d.monthlyAmount }))

  return (
    <section>
      <h3 style={{ margin: '0 0 var(--space-3)' }}>{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
              stroke="#1c1f28"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1c1f28',
                border: '1px solid #2a3040',
                borderRadius: 2,
                color: '#f4f5f7',
                fontFamily: 'var(--font-body)',
              }}
              formatter={(value) => [formatCurrency(Number(value)), 'Monthly']}
            />
            <Legend wrapperStyle={{ color: '#f4f5f7', fontFamily: 'var(--font-body)', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
