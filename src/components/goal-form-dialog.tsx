'use client'

import { useRef, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createGoal, updateGoal } from '@/app/dashboard/planning/actions'
import { GOAL_CATEGORIES, GOAL_CATEGORY_LABELS } from '@/lib/types'
import type { FinancialGoal, GoalCategory } from '@/lib/types'

interface Props {
  goal?: FinancialGoal | null
  open: boolean
  onClose: () => void
}

export function GoalFormDialog({ goal, open, onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (open) setError(null)
  }, [open, goal])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = formData.get('id')
      ? await updateGoal(formData)
      : await createGoal(formData)

    setIsPending(false)
    if (result.success) {
      toast.success(formData.get('id') ? 'Goal saved' : 'Goal added')
      formRef.current?.reset()
      onClose()
    } else {
      setError(result.error ?? 'Something went wrong')
    }
  }

  const isEditing = !!goal

  if (!open) return null

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
          <h2 className="dialog-title">{isEditing ? 'Edit Goal' : 'Add Goal'}</h2>

          {goal && <input type="hidden" name="id" value={goal.id} />}

          {error && (
            <p className="amt-warn" style={{ margin: 0, fontSize: '13px' }}>{error}</p>
          )}

          <div className="field">
            <label htmlFor="goal-name">Goal Name</label>
            <input
              id="goal-name"
              name="name"
              type="text"
              required
              defaultValue={goal?.name ?? ''}
              className="input"
              placeholder="e.g. Net worth $100K"
            />
          </div>

          <div className="field">
            <label htmlFor="goal-category">Category</label>
            <select
              id="goal-category"
              name="category"
              defaultValue={goal?.category ?? 'net_worth'}
              className="input select"
            >
              {GOAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{GOAL_CATEGORY_LABELS[c as GoalCategory]}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="goal-target">Target Value ($)</label>
            <input
              id="goal-target"
              name="target_value"
              type="number"
              step="0.01"
              required
              defaultValue={goal?.target_value ?? ''}
              className="input"
              placeholder="100000"
            />
          </div>

          <div className="field">
            <label htmlFor="goal-current">Current Value ($)</label>
            <input
              id="goal-current"
              name="current_value"
              type="number"
              step="0.01"
              defaultValue={goal?.current_value ?? 0}
              className="input"
              placeholder="0"
            />
          </div>

          <div className="field">
            <label htmlFor="goal-date">Target Date (optional)</label>
            <input
              id="goal-date"
              name="target_date"
              type="date"
              defaultValue={goal?.target_date ?? ''}
              className="input"
            />
          </div>

          <div className="field">
            <label htmlFor="goal-notes">Notes (optional)</label>
            <textarea
              id="goal-notes"
              name="notes"
              rows={2}
              defaultValue={goal?.notes ?? ''}
              className="input"
            />
          </div>

          <div className="dialog-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary"
            >
              {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
