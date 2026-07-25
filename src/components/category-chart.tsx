'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/format'
import type { CategoryBreakdown } from '@/lib/cash-flow-calculator'

// Broadsheet palette: cyan lead, magenta second, neutrals for the long tail.
const COLORS = [
  '#0088b0', '#d6006c', '#9b9797', '#605d5d', '#bab6b6',
  '#38a6cf', '#004961', '#790e3d', '#444141', '#d7d3d3',
  '#006786', '#aa0b56', '#7d7979', '#62c5ee',
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
              stroke="#f3f2f2"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#f3f2f2',
                border: '1px solid #d7d3d3',
                borderRadius: 2,
                color: '#201e1d',
                fontFamily: 'var(--font-body)',
              }}
              formatter={(value) => [formatCurrency(Number(value)), 'Monthly']}
            />
            <Legend wrapperStyle={{ color: '#201e1d', fontFamily: 'var(--font-body)', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
