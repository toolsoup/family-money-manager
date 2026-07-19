'use client'

import { useState, useTransition } from 'react'
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
  colorClass: string
  defaultType: CashFlowType
}

export function CashFlowList({ title, entries, monthlyTotal, colorClass, defaultType }: Props) {
  const [editingEntry, setEditingEntry] = useState<CashFlowEntry | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return
    setDeletingId(id)
    startTransition(async () => {
      await deleteCashFlowEntry(id)
      setDeletingId(null)
    })
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{formatCurrency(monthlyTotal)}/mo</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          + Add
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="p-6 text-gray-500 text-sm">No entries yet. Click + Add to get started.</p>
      ) : (
        <div className="divide-y divide-gray-800">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-4 px-6 ${
                deletingId === entry.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{entry.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-gray-600 text-xs bg-gray-800 px-2 py-0.5 rounded">
                    {entry.category}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {formatCurrency(entry.amount)} {FREQUENCY_LABELS[entry.frequency]}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${colorClass}`}>
                  {formatCurrency(toMonthly(entry.amount, entry.frequency))}/mo
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingEntry(entry)}
                    className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={isPending}
                    className="text-gray-500 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
    </div>
  )
}
