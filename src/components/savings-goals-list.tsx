'use client'

import { useState, useTransition } from 'react'
import { deleteSavingsGoal } from '@/app/dashboard/cash-flow/actions'
import { SavingsGoalFormDialog } from '@/components/savings-goal-form-dialog'
import { formatCurrency } from '@/lib/format'
import type { SavingsGoal } from '@/lib/types'

interface Props {
  goals: SavingsGoal[]
  monthlySurplus: number
}

export function SavingsGoalsList({ goals, monthlySurplus }: Props) {
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    if (!confirm('Delete this goal?')) return
    setDeletingId(id)
    startTransition(async () => {
      await deleteSavingsGoal(id)
      setDeletingId(null)
    })
  }

  function monthsToGoal(goal: SavingsGoal): string {
    const remaining = goal.target_amount - goal.current_amount
    if (remaining <= 0) return 'Reached!'
    if (monthlySurplus <= 0) return 'N/A'
    const months = Math.ceil(remaining / monthlySurplus)
    const years = Math.floor(months / 12)
    const mo = months % 12
    if (years === 0) return `${mo} mo`
    if (mo === 0) return `${years} yr`
    return `${years} yr ${mo} mo`
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Savings Goals</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          + Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="p-6 text-gray-500 text-sm">No savings goals yet. Click + Add Goal to set a target.</p>
      ) : (
        <div className="divide-y divide-gray-800">
          {goals.map((goal) => {
            const progress = goal.target_amount > 0
              ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
              : 0

            return (
              <div
                key={goal.id}
                className={`p-4 px-6 ${deletingId === goal.id ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white text-sm font-medium">{goal.name}</p>
                    {goal.deadline && (
                      <p className="text-gray-500 text-xs mt-0.5">
                        Target: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-white text-sm font-medium">
                        {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {monthlySurplus > 0 ? `~${monthsToGoal(goal)} at current surplus` : ''}
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
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gray-500 text-xs mt-1">{progress.toFixed(0)}% complete</p>
              </div>
            )
          })}
        </div>
      )}

      <SavingsGoalFormDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
      />
      <SavingsGoalFormDialog
        key={editingGoal?.id}
        goal={editingGoal}
        open={!!editingGoal}
        onClose={() => setEditingGoal(null)}
      />
    </div>
  )
}
