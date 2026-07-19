'use client'

import { useState, useTransition } from 'react'
import { deleteAccount } from '@/app/dashboard/net-worth/actions'
import { AccountFormDialog } from '@/components/account-form-dialog'
import { ACCOUNT_TYPE_LABELS } from '@/lib/types'
import { formatCurrency } from '@/lib/format'
import type { Account } from '@/lib/types'

interface Props {
  title: string
  accounts: Account[]
  total: number
  colorClass: string
}

export function AccountList({ title, accounts, total, colorClass }: Props) {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    if (!confirm('Delete this account?')) return
    setDeletingId(id)
    startTransition(async () => {
      await deleteAccount(id)
      setDeletingId(null)
    })
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{formatCurrency(total)}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          + Add
        </button>
      </div>

      {accounts.length === 0 ? (
        <p className="p-6 text-gray-500 text-sm">No accounts yet. Click + Add to get started.</p>
      ) : (
        <div className="divide-y divide-gray-800">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`flex items-center justify-between p-4 px-6 ${
                deletingId === account.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{account.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {account.institution && (
                    <span className="text-gray-500 text-xs">{account.institution}</span>
                  )}
                  <span className="text-gray-600 text-xs bg-gray-800 px-2 py-0.5 rounded">
                    {ACCOUNT_TYPE_LABELS[account.type]}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${colorClass}`}>
                  {formatCurrency(account.balance)}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingAccount(account)}
                    className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
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

      <AccountFormDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
      />

      <AccountFormDialog
        key={editingAccount?.id}
        account={editingAccount}
        open={!!editingAccount}
        onClose={() => setEditingAccount(null)}
      />
    </div>
  )
}
