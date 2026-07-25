'use client'

import { useRef, useEffect, useState } from 'react'
import { toast } from 'sonner'
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
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [selectedType, setSelectedType] = useState<CashFlowType>(entry?.type ?? defaultType)

  const categories = selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  useEffect(() => {
    if (open) {
      setError(null)
      setSelectedType(entry?.type ?? defaultType)
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
      toast.success(formData.get('id') ? 'Entry saved' : 'Entry added')
      formRef.current?.reset()
      onClose()
    } else {
      setError(result.error ?? 'Something went wrong')
    }
  }

  const isEditing = !!entry

  if (!open) return null

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="dialog-title">{isEditing ? 'Edit entry' : 'Add entry'}</h2>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
          {entry && <input type="hidden" name="id" value={entry.id} />}

          {error && (
            <p className="amt-warn" style={{ margin: 0, fontSize: '14px' }}>{error}</p>
          )}

          <div className="field">
            <label htmlFor="cf-name">Name</label>
            <input
              id="cf-name"
              name="name"
              type="text"
              required
              defaultValue={entry?.name ?? ''}
              className="input"
              placeholder="e.g. Salary, Rent"
            />
          </div>

          <div className="field">
            <label htmlFor="cf-type">Type</label>
            <select
              id="cf-type"
              name="type"
              defaultValue={entry?.type ?? defaultType}
              onChange={(e) => setSelectedType(e.target.value as CashFlowType)}
              className="input select"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="cf-category">Category</label>
            <select
              id="cf-category"
              name="category"
              defaultValue={entry?.category ?? categories[0]}
              key={selectedType}
              className="input select"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="cf-amount">Amount</label>
            <input
              id="cf-amount"
              name="amount"
              type="number"
              step="0.01"
              required
              defaultValue={entry?.amount ?? ''}
              className="input"
              placeholder="0.00"
            />
          </div>

          <div className="field">
            <label htmlFor="cf-frequency">Frequency</label>
            <select
              id="cf-frequency"
              name="frequency"
              defaultValue={entry?.frequency ?? 'monthly'}
              className="input select"
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>{FREQUENCY_LABELS[f]}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="cf-notes">Notes (optional)</label>
            <textarea
              id="cf-notes"
              name="notes"
              rows={2}
              defaultValue={entry?.notes ?? ''}
              className="input"
            />
          </div>

          <div className="dialog-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="btn btn-primary">
              {isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Add entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
