'use client'

import { useRef, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createSavingsGoal, updateSavingsGoal } from '@/app/dashboard/cash-flow/actions'
import type { SavingsGoal } from '@/lib/types'

interface Props {
  goal?: SavingsGoal | null
  open: boolean
  onClose: () => void
}

export function SavingsGoalFormDialog({ goal, open, onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (open) {
      setError(null)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = formData.get('id')
      ? await updateSavingsGoal(formData)
      : await createSavingsGoal(formData)

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
        <h2 className="dialog-title">{isEditing ? 'Edit goal' : 'Add savings goal'}</h2>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
          {goal && <input type="hidden" name="id" value={goal.id} />}

          {error && (
            <p className="amt-warn" style={{ margin: 0, fontSize: '14px' }}>{error}</p>
          )}

          <div className="field">
            <label htmlFor="sg-name">Goal name</label>
            <input
              id="sg-name"
              name="name"
              type="text"
              required
              defaultValue={goal?.name ?? ''}
              className="input"
              placeholder="e.g. Emergency Fund, Vacation"
            />
          </div>

          <div className="field">
            <label htmlFor="sg-target">Target amount</label>
            <input
              id="sg-target"
              name="target_amount"
              type="number"
              step="0.01"
              required
              defaultValue={goal?.target_amount ?? ''}
              className="input"
              placeholder="10000.00"
            />
          </div>

          <div className="field">
            <label htmlFor="sg-current">Current amount</label>
            <input
              id="sg-current"
              name="current_amount"
              type="number"
              step="0.01"
              defaultValue={goal?.current_amount ?? 0}
              className="input"
              placeholder="0.00"
            />
          </div>

          <div className="field">
            <label htmlFor="sg-deadline">Target date (optional)</label>
            <input
              id="sg-deadline"
              name="deadline"
              type="date"
              defaultValue={goal?.deadline ?? ''}
              className="input"
            />
          </div>

          <div className="field">
            <label htmlFor="sg-notes">Notes (optional)</label>
            <textarea
              id="sg-notes"
              name="notes"
              rows={2}
              defaultValue={goal?.notes ?? ''}
              className="input"
            />
          </div>

          <div className="dialog-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="btn btn-primary">
              {isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Add goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
