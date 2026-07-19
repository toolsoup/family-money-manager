'use client'

import { useRef, useEffect, useState } from 'react'
import { createCashFlowEntry, updateCashFlowEntry } from '@/app/dashboard/cash-flow/actions'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, FREQUENCY_LABELS } from '@/lib/types'
import type { CashFlowEntry, CashFlowType, CashFlowFrequency } from '@/lib/types'

const FREQUENCIES = Object.keys(FREQUENCY_LABELS) as CashFlowFrequency[]

interface Props {
  entry?: CashFlowEntry | null
  open: boolean
  onClose: () => void
  defaultType?: CashFlowType
}

export function CashFlowFormDialog({ entry, open, onClose, defaultType = 'income' }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [selectedType, setSelectedType] = useState<CashFlowType>(entry?.type ?? defaultType)

  const categories = selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      setError(null)
      setSelectedType(entry?.type ?? defaultType)
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open, entry, defaultType])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = formData.get('id')
      ? await updateCashFlowEntry(formData)
      : await createCashFlowEntry(formData)

    setIsPending(false)
    if (result.success) {
      formRef.current?.reset()
      onClose()
    } else {
      setError(result.error ?? 'Something went wrong')
    }
  }

  const isEditing = !!entry

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="bg-gray-900 border border-gray-700 rounded-xl p-0 w-full max-w-md backdrop:bg-black/60"
    >
      <form ref={formRef} onSubmit={handleSubmit} className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          {isEditing ? 'Edit Entry' : 'Add Entry'}
        </h2>

        {entry && <input type="hidden" name="id" value={entry.id} />}

        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="cf-name" className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              id="cf-name"
              name="name"
              type="text"
              required
              defaultValue={entry?.name ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. Salary, Rent"
            />
          </div>

          <div>
            <label htmlFor="cf-type" className="block text-sm text-gray-400 mb-1">Type</label>
            <select
              id="cf-type"
              name="type"
              defaultValue={entry?.type ?? defaultType}
              onChange={(e) => setSelectedType(e.target.value as CashFlowType)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label htmlFor="cf-category" className="block text-sm text-gray-400 mb-1">Category</label>
            <select
              id="cf-category"
              name="category"
              defaultValue={entry?.category ?? categories[0]}
              key={selectedType}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cf-amount" className="block text-sm text-gray-400 mb-1">Amount</label>
            <input
              id="cf-amount"
              name="amount"
              type="number"
              step="0.01"
              required
              defaultValue={entry?.amount ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="cf-frequency" className="block text-sm text-gray-400 mb-1">Frequency</label>
            <select
              id="cf-frequency"
              name="frequency"
              defaultValue={entry?.frequency ?? 'monthly'}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>{FREQUENCY_LABELS[f]}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cf-notes" className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
            <textarea
              id="cf-notes"
              name="notes"
              rows={2}
              defaultValue={entry?.notes ?? ''}
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
            {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Entry'}
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
