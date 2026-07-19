'use client'

import { useRef, useEffect, useState } from 'react'
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
  const dialogRef = useRef<HTMLDialogElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [selectedType, setSelectedType] = useState<AccountType>(initialType)
  const showDebtFields = isLiabilityType(selectedType)

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
      ? await updateAccount(formData)
      : await createAccount(formData)

    setIsPending(false)

    if (result.success) {
      formRef.current?.reset()
      onClose()
    } else {
      setError(result.error ?? 'Something went wrong')
    }
  }

  const isEditing = !!account

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="bg-gray-900 border border-gray-700 rounded-xl p-0 w-full max-w-md backdrop:bg-black/60"
    >
      <form ref={formRef} onSubmit={handleSubmit} className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          {isEditing ? 'Edit Account' : 'Add Account'}
        </h2>

        {account && <input type="hidden" name="id" value={account.id} />}

        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-400 mb-1">Account Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={account?.name ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. Chase Checking"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm text-gray-400 mb-1">Type</label>
            <select
              id="type"
              name="type"
              defaultValue={initialType}
              onChange={(e) => setSelectedType(e.target.value as AccountType)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>{ACCOUNT_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="balance" className="block text-sm text-gray-400 mb-1">Balance</label>
            <input
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              required
              defaultValue={account?.balance ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          {showDebtFields && (
            <>
              <div>
                <label htmlFor="interest_rate" className="block text-sm text-gray-400 mb-1">Interest Rate (APR %)</label>
                <input
                  id="interest_rate"
                  name="interest_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={account?.interest_rate ?? ''}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 24.99"
                />
              </div>
              <div>
                <label htmlFor="minimum_payment" className="block text-sm text-gray-400 mb-1">Minimum Monthly Payment</label>
                <input
                  id="minimum_payment"
                  name="minimum_payment"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={account?.minimum_payment ?? ''}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="institution" className="block text-sm text-gray-400 mb-1">Institution (optional)</label>
            <input
              id="institution"
              name="institution"
              type="text"
              defaultValue={account?.institution ?? ''}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. Chase, Vanguard"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              defaultValue={account?.notes ?? ''}
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
            {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Account'}
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
