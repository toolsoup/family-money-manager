'use client'

import { useState, useTransition } from 'react'
import { deleteGoal } from '@/app/dashboard/planning/actions'
import { GoalFormDialog } from '@/components/goal-form-dialog'
import { formatCurrency } from '@/lib/format'
import { calculateGoalMilestones } from '@/lib/projection-calculator'
import { GOAL_CATEGORY_LABELS } from '@/lib/types'
import type { FinancialGoal, GoalCategory } from '@/lib/types'

interface Props {
  goals: FinancialGoal[]
  monthlySurplus: number
}

export function GoalList({ goals, monthlySurplus }: Props) {
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    if (!confirm('Delete this goal?')) return
    setDeletingId(id)
    startTransition(async () => {
      await deleteGoal(id)
      setDeletingId(null)
    })
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Financial Goals</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          + Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="p-6 text-gray-500 text-sm">No goals yet. Click + Add Goal to set your first financial target.</p>
      ) : (
        <div className="divide-y divide-gray-800">
          {goals.map((goal) => {
            const progress = goal.target_value > 0
              ? Math.min(100, (goal.current_value / goal.target_value) * 100)
              : 0
            const monthlyProgress = monthlySurplus > 0 ? monthlySurplus : 0
            const milestones = calculateGoalMilestones(goal, monthlyProgress)
            const isComplete = goal.current_value >= goal.target_value

            return (
              <div
                key={goal.id}
                className={`p-6 ${deletingId === goal.id ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium text-sm">{goal.name}</h3>
                      <span className="text-gray-500 text-xs bg-gray-800 px-2 py-0.5 rounded">
                        {GOAL_CATEGORY_LABELS[goal.category as GoalCategory] ?? goal.category}
                      </span>
                      {isComplete && (
                        <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded">
                          Complete
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {formatCurrency(goal.current_value)} of {formatCurrency(goal.target_value)}
                      {goal.target_date && ` · Target: ${new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      disabled={isPending}
                      className="text-gray-500 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-3">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                      isComplete ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                  {/* Milestone markers */}
                  {[25, 50, 75].map((pct) => (
                    <div
                      key={pct}
                      className="absolute top-0 bottom-0 w-px bg-gray-600"
                      style={{ left: `${pct}%` }}
                    />
                  ))}
                </div>

                {/* Milestones */}
                <div className="grid grid-cols-4 gap-2">
                  {milestones.map((m) => (
                    <div key={m.percent} className="text-center">
                      <p className={`text-xs font-medium ${m.reached ? 'text-green-400' : 'text-gray-500'}`}>
                        {m.percent}%
                      </p>
                      <p className="text-[10px] text-gray-600">
                        {formatCurrency(m.value)}
                      </p>
                      <p className={`text-[10px] ${m.reached ? 'text-green-400' : 'text-gray-500'}`}>
                        {m.projectedDate ?? '—'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <GoalFormDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
      />
      <GoalFormDialog
        key={editingGoal?.id}
        goal={editingGoal}
        open={!!editingGoal}
        onClose={() => setEditingGoal(null)}
      />
    </div>
  )
}
