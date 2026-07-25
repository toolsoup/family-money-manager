'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { createAccount, updateAccount } from '@/app/dashboard/net-worth/actions'
import { ACCOUNT_TYPE_LABELS, isLiabilityType } from '@/lib/types'
import type { Account, AccountType } from '@/lib/types'

const ALL_TYPES = Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]

interface Props {
  account?: Account | null
  open: boolean
  onClose: () => void
  defaultType?: AccountType
}

export function AccountFormDialog({ account, open, onClose, defaultType }: Props) {
  const initialType = account?.type ?? defaultType ?? 'checking'
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [selectedType, setSelectedType] = useState<AccountType>(initialType)
  const showDebtFields = isLiabilityType(selectedType)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = formData.get('id')
      ? await updateAccount(formData)
      : await createAccount(formData)

    setIsPending(false)

    if (result.success) {
      toast.success(formData.get('id') ? 'Account saved' : 'Account added')
      formRef.current?.reset()
      onClose()
    } else {
      setError(result.error ?? 'Something went wrong')
    }
  }

  if (!open) return null

  const isEditing = !!account

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="dialog-title">{isEditing ? 'Edit Account' : 'Add Account'}</h2>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
          {account && <input type="hidden" name="id" value={account.id} />}

          {error && (
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: 'var(--color-accent-2-700)',
                background: 'var(--color-accent-2-100)',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {error}
            </p>
          )}

          <div className="field">
            <label htmlFor="name">Account Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={account?.name ?? ''}
              className="input"
              placeholder="e.g. Chase Checking"
            />
          </div>

          <div className="field">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              defaultValue={initialType}
              onChange={(e) => setSelectedType(e.target.value as AccountType)}
              className="select"
            >
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>{ACCOUNT_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="balance">Balance</label>
            <input
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              required
              defaultValue={account?.balance ?? ''}
              className="input"
              placeholder="0.00"
            />
          </div>

          {showDebtFields && (
            <>
              <div className="field">
                <label htmlFor="interest_rate">Interest Rate (APR %)</label>
                <input
                  id="interest_rate"
                  name="interest_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={account?.interest_rate ?? ''}
                  className="input"
                  placeholder="e.g. 24.99"
                />
              </div>
              <div className="field">
                <label htmlFor="minimum_payment">Minimum Monthly Payment</label>
                <input
                  id="minimum_payment"
                  name="minimum_payment"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={account?.minimum_payment ?? ''}
                  className="input"
                  placeholder="0.00"
                />
              </div>
            </>
          )}

          <div className="field">
            <label htmlFor="institution">Institution (optional)</label>
            <input
              id="institution"
              name="institution"
              type="text"
              defaultValue={account?.institution ?? ''}
              className="input"
              placeholder="e.g. Chase, Vanguard"
            />
          </div>

          <div className="field">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              defaultValue={account?.notes ?? ''}
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
              {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
