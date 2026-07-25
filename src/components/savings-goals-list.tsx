'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
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
      const result = await deleteSavingsGoal(id)
      if (result.success) {
        toast.success('Goal deleted')
      } else {
        toast.error(result.error ?? 'Failed to delete goal')
      }
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
    <section>
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
        <h3 style={{ margin: 0 }}>Savings goals</h3>
        <button onClick={() => setShowAdd(true)} className="btn btn-secondary" type="button">
          + Add goal
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="text-muted" style={{ fontSize: '14px' }}>
          No savings goals yet. Click + Add goal to set a target.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {goals.map((goal) => {
            const reached = goal.target_amount > 0 && goal.current_amount >= goal.target_amount
            const progress = goal.target_amount > 0
              ? Math.min(100, (goal.current_amount / goal.target_amount) * 100)
              : 0

            return (
              <div key={goal.id} className="card" style={{ opacity: deletingId === goal.id ? 0.5 : 1 }}>
                <div className="flex items-start justify-between" style={{ gap: 'var(--space-3)' }}>
                  <div className="min-w-0">
                    <p className="card-title truncate">{goal.name}</p>
                    {goal.deadline && (
                      <p className="text-muted tnum" style={{ margin: '2px 0 0', fontSize: '12px' }}>
                        Target: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex" style={{ gap: '2px' }}>
                    <button onClick={() => setEditingGoal(goal)} className="btn btn-ghost" type="button">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      disabled={isPending}
                      className="btn btn-danger"
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="tnum" style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '18px' }}>
                  {formatCurrency(goal.current_amount)}
                  <span className="text-muted" style={{ fontWeight: 400, fontSize: '14px' }}>
                    {' '}/ {formatCurrency(goal.target_amount)}
                  </span>
                </p>

                <div className="meter">
                  <i className={reached ? '' : 'mute'} style={{ width: `${progress}%` }} />
                </div>

                <div className="flex items-baseline justify-between text-muted" style={{ fontSize: '12px' }}>
                  <span className="tnum">{progress.toFixed(0)}% complete</span>
                  {monthlySurplus > 0 && <span>~{monthsToGoal(goal)} at current surplus</span>}
                </div>
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
    </section>
  )
}
