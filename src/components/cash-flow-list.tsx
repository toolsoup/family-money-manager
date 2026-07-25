'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteCashFlowEntry } from '@/app/dashboard/cash-flow/actions'
import { CashFlowFormDialog } from '@/components/cash-flow-form-dialog'
import { FREQUENCY_LABELS } from '@/lib/types'
import { formatCurrency } from '@/lib/format'
import { toMonthly } from '@/lib/cash-flow-calculator'
import type { CashFlowEntry, CashFlowType } from '@/lib/types'

interface Props {
  title: string
  entries: CashFlowEntry[]
  monthlyTotal: number
  defaultType: CashFlowType
}

export function CashFlowList({ title, entries, monthlyTotal, defaultType }: Props) {
  const [editingEntry, setEditingEntry] = useState<CashFlowEntry | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isIncome = defaultType === 'income'

  function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteCashFlowEntry(id)
      if (result.success) {
        toast.success('Entry deleted')
      } else {
        toast.error(result.error ?? 'Failed to delete entry')
      }
      setDeletingId(null)
    })
  }

  return (
    <section>
      <div className="flex items-end justify-between" style={{ marginBottom: 'var(--space-3)' }}>
        <div>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <p
            className={`tnum ${isIncome ? 'amt-pos' : ''}`}
            style={{ margin: '2px 0 0', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '25px' }}
          >
            {formatCurrency(monthlyTotal)}/mo
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn btn-secondary" type="button">
          + Add
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="text-muted" style={{ fontSize: '14px' }}>No entries yet. Click + Add to get started.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>What</th>
              <th>Category</th>
              <th style={{ textAlign: 'right' }}>Per month</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} style={{ opacity: deletingId === entry.id ? 0.5 : 1 }}>
                <td>
                  <strong>{entry.name}</strong><br />
                  <span className="text-muted tnum" style={{ fontSize: '13px' }}>
                    {formatCurrency(entry.amount)} {FREQUENCY_LABELS[entry.frequency]}
                  </span>
                </td>
                <td><span className="tag tag-neutral">{entry.category}</span></td>
                <td className={`tnum ${isIncome ? 'amt-pos' : ''}`} style={{ textAlign: 'right' }}>
                  {formatCurrency(toMonthly(entry.amount, entry.frequency))}/mo
                </td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button onClick={() => setEditingEntry(entry)} className="btn btn-ghost" type="button">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={isPending}
                    className="btn btn-danger"
                    type="button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CashFlowFormDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        defaultType={defaultType}
      />
      <CashFlowFormDialog
        key={editingEntry?.id}
        entry={editingEntry}
        open={!!editingEntry}
        onClose={() => setEditingEntry(null)}
      />
    </section>
  )
}
