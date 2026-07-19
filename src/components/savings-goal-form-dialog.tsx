'use client'

import { useRef, useEffect, useState } from 'react'
import { createSavingsGoal, updateSavingsGoal } from '@/app/dashboard/cash-flow/actions'
import type { SavingsGoal } from '@/lib/types'

interface Props {
  goal?: SavingsGoal | null
  open: boolean
  onClose: () => void
}

export function SavingsGoalFormDialog({ goal, open, onClose }: Props) {
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
          {isEditing ? 'Edit Goal' : 'Add Savings Goal'}
        </h2>

        {goal && <input type="hidden" name="id" value={goal.id} />}

        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="sg-name" className="block text-sm text-gray-400 mb-1">Goal Name</label>
            <input
              id="sg-name"
              name="name"
              type="text"
              required
              defaultValue={goal?.name ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. Emergency Fund, Vacation"
            />
          </div>

          <div>
            <label htmlFor="sg-target" className="block text-sm text-gray-400 mb-1">Target Amount</label>
            <input
              id="sg-target"
              name="target_amount"
              type="number"
              step="0.01"
              required
              defaultValue={goal?.target_amount ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="10000.00"
            />
          </div>

          <div>
            <label htmlFor="sg-current" className="block text-sm text-gray-400 mb-1">Current Amount</label>
            <input
              id="sg-current"
              name="current_amount"
              type="number"
              step="0.01"
              defaultValue={goal?.current_amount ?? 0}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="sg-deadline" className="block text-sm text-gray-400 mb-1">Target Date (optional)</label>
            <input
              id="sg-deadline"
              name="deadline"
              type="date"
              defaultValue={goal?.deadline ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="sg-notes" className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
            <textarea
              id="sg-notes"
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
