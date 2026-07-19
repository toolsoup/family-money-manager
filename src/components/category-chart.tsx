'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/format'
import type { CategoryBreakdown } from '@/lib/cash-flow-calculator'

const COLORS = [
  '#ef4444', '#3b82f6', '#a855f7', '#f59e0b', '#10b981',
  '#ec4899', '#06b6d4', '#f97316', '#8b5cf6', '#14b8a6',
  '#e11d48', '#6366f1', '#84cc16', '#d946ef',
]

interface Props {
  data: CategoryBreakdown[]
  title: string
}

export function CategoryChart({ data, title }: Props) {
  if (data.length === 0) return null

  const chartData = data.map((d) => ({ name: d.category, value: d.monthlyAmount }))

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
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
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
              formatter={(value) => [formatCurrency(Number(value)), 'Monthly']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
