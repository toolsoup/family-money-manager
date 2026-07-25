'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteAccount } from '@/app/dashboard/net-worth/actions'
import { AccountFormDialog } from '@/components/account-form-dialog'
import { ACCOUNT_TYPE_LABELS } from '@/lib/types'
import { formatCurrency, formatPercent } from '@/lib/format'
import type { Account, AccountType } from '@/lib/types'

interface Props {
  title: string
  accounts: Account[]
  total: number
  defaultType?: AccountType
}

export function AccountList({ title, accounts, total, defaultType }: Props) {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isLiability = accounts.length > 0 && accounts.every((a) => !a.is_asset)
  const signedTotal = isLiability ? `−${formatCurrency(total)}` : formatCurrency(total)

  function handleDelete(id: string) {
    if (!confirm('Delete this account?')) return
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteAccount(id)
      if (result.success) {
        toast.success('Account deleted')
      } else {
        toast.error(result.error ?? 'Failed to delete account')
      }
      setDeletingId(null)
    })
  }

  return (
    <div>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 'var(--space-3)' }}
      >
        <div>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <p
            className="tnum"
            style={{ margin: '4px 0 0', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '25px' }}
          >
            {signedTotal}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn btn-secondary">
          + Add
        </button>
      </div>

      {accounts.length === 0 ? (
        <p className="text-muted" style={{ fontSize: '14px' }}>
          No accounts yet. Click + Add to get started.
        </p>
      ) : (
        <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
          {accounts.map((account) => (
            <div
              key={account.id}
              className="card flex items-center justify-between"
              style={{
                flexDirection: 'row',
                gap: 'var(--space-4)',
                opacity: deletingId === account.id ? 0.5 : 1,
              }}
            >
              <div className="flex-1 min-w-0">
                <p style={{ margin: 0, fontSize: '15px' }} className="truncate">{account.name}</p>
                <div className="flex items-center" style={{ gap: 'var(--space-2)', marginTop: '4px', flexWrap: 'wrap' }}>
                  {account.institution && (
                    <span className="text-muted" style={{ fontSize: '12px' }}>{account.institution}</span>
                  )}
                  <span className="tag tag-neutral">{ACCOUNT_TYPE_LABELS[account.type]}</span>
                  {account.interest_rate != null && (
                    <span className="text-muted tnum" style={{ fontSize: '12px' }}>{formatPercent(account.interest_rate)} APR</span>
                  )}
                  {account.minimum_payment != null && (
                    <span className="text-muted tnum" style={{ fontSize: '12px' }}>{formatCurrency(account.minimum_payment)}/mo</span>
                  )}
                </div>
              </div>
              <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
                <span className="tnum" style={{ fontSize: '15px' }}>
                  {account.is_asset ? formatCurrency(account.balance) : `−${formatCurrency(account.balance)}`}
                </span>
                <div className="flex" style={{ gap: '2px' }}>
                  <button
                    onClick={() => setEditingAccount(account)}
                    className="btn btn-ghost"
                    style={{ fontSize: '13px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    disabled={isPending}
                    className="btn btn-danger"
                    style={{ fontSize: '13px' }}
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
        defaultType={defaultType}
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
