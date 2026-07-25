'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
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
      const result = await deleteGoal(id)
      if (result.success) {
        toast.success('Goal deleted')
      } else {
        toast.error(result.error ?? 'Failed to delete goal')
      }
      setDeletingId(null)
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
        <h3 style={{ margin: 0 }}>Financial Goals</h3>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary" type="button">
          <svg viewBox="0 0 256 256" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
          </svg>
          Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <p className="text-muted">No goals yet. Add your first financial target to start tracking progress.</p>
      ) : (
        <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
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
                className="card"
                style={{ opacity: deletingId === goal.id ? 0.5 : 1 }}
              >
                <div className="flex items-start justify-between" style={{ gap: 'var(--space-3)' }}>
                  <div>
                    <div className="flex items-center" style={{ gap: '8px', flexWrap: 'wrap' }}>
                      <span className="card-title">{goal.name}</span>
                      <span className="tag tag-neutral">
                        {GOAL_CATEGORY_LABELS[goal.category as GoalCategory] ?? goal.category}
                      </span>
                      {isComplete && <span className="tag tag-accent">Complete</span>}
                    </div>
                    <p className="text-muted tnum" style={{ margin: '4px 0 0', fontSize: '13px' }}>
                      {formatCurrency(goal.current_value)} of {formatCurrency(goal.target_value)}
                      {goal.target_date && ` · Target: ${new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    </p>
                  </div>
                  <div className="flex" style={{ gap: '4px', flex: 'none' }}>
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="btn btn-ghost"
                      type="button"
                    >
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

                {/* Progress bar with milestone markers */}
                <div className="meter" style={{ position: 'relative' }}>
                  <i style={{ width: `${progress}%` }} />
                  {[25, 50, 75].map((pct) => (
                    <span
                      key={pct}
                      style={{
                        position: 'absolute', top: 0, bottom: 0, width: '1px',
                        left: `${pct}%`, background: 'var(--color-neutral-400)',
                      }}
                    />
                  ))}
                </div>

                {/* Milestones */}
                <div className="grid grid-cols-4" style={{ gap: 'var(--space-2)' }}>
                  {milestones.map((m) => (
                    <div key={m.percent} className="text-center tnum">
                      <p className={m.reached ? 'amt-pos' : 'text-muted'} style={{ margin: 0, fontSize: '13px' }}>
                        {m.percent}%
                      </p>
                      <p className="text-muted" style={{ margin: 0, fontSize: '11px' }}>
                        {formatCurrency(m.value)}
                      </p>
                      <p className={m.reached ? 'amt-pos' : 'text-muted'} style={{ margin: 0, fontSize: '11px' }}>
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
