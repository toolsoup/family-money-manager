'use client'

import { useRef, useEffect, useState } from 'react'
import { createGoal, updateGoal } from '@/app/dashboard/planning/actions'
import { GOAL_CATEGORIES, GOAL_CATEGORY_LABELS } from '@/lib/types'
import type { FinancialGoal, GoalCategory } from '@/lib/types'

interface Props {
  goal?: FinancialGoal | null
  open: boolean
  onClose: () => void
}

export function GoalFormDialog({ goal, open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      setError(null)
      dialog.showModal()
    } else {
      dialog.close()
    }
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
      formRef.current?.reset()
      onClose()
    } else {
      setError(result.error ?? 'Something went wrong')
    }
  }

  const isEditing = !!goal

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="bg-gray-900 border border-gray-700 rounded-xl p-0 w-full max-w-md backdrop:bg-black/60"
    >
      <form ref={formRef} onSubmit={handleSubmit} className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          {isEditing ? 'Edit Goal' : 'Add Goal'}
        </h2>

        {goal && <input type="hidden" name="id" value={goal.id} />}

        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="goal-name" className="block text-sm text-gray-400 mb-1">Goal Name</label>
            <input
              id="goal-name"
              name="name"
              type="text"
              required
              defaultValue={goal?.name ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. Net worth $100K"
            />
          </div>

          <div>
            <label htmlFor="goal-category" className="block text-sm text-gray-400 mb-1">Category</label>
            <select
              id="goal-category"
              name="category"
              defaultValue={goal?.category ?? 'net_worth'}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {GOAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{GOAL_CATEGORY_LABELS[c as GoalCategory]}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="goal-target" className="block text-sm text-gray-400 mb-1">Target Value ($)</label>
            <input
              id="goal-target"
              name="target_value"
              type="number"
              step="0.01"
              required
              defaultValue={goal?.target_value ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="100000"
            />
          </div>

          <div>
            <label htmlFor="goal-current" className="block text-sm text-gray-400 mb-1">Current Value ($)</label>
            <input
              id="goal-current"
              name="current_value"
              type="number"
              step="0.01"
              defaultValue={goal?.current_value ?? 0}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="goal-date" className="block text-sm text-gray-400 mb-1">Target Date (optional)</label>
            <input
              id="goal-date"
              name="target_date"
              type="date"
              defaultValue={goal?.target_date ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="goal-notes" className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
            <textarea
              id="goal-notes"
              name="notes"
              rows={2}
              defaultValue={goal?.notes ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
          >
            {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Goal'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  )
}
