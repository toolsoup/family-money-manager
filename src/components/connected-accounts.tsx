'use client'

import { useState, useTransition } from 'react'
import { disconnectPlaidItem } from '@/app/dashboard/settings/actions'
import { PlaidLinkButton } from '@/components/plaid-link-button'
import { formatCurrency } from '@/lib/format'
import type { PlaidItem, PlaidAccount } from '@/lib/types'

interface Props {
  items: PlaidItem[]
  accounts: PlaidAccount[]
  isPlaidConfigured: boolean
}

export function ConnectedAccounts({ items, accounts, isPlaidConfigured }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDisconnect(itemId: string, name: string | null) {
    if (!confirm(`Disconnect ${name ?? 'this institution'}? All synced accounts will be removed.`)) return
    setDeletingId(itemId)
    startTransition(async () => {
      await disconnectPlaidItem(itemId)
      setDeletingId(null)
    })
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return 'Never'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Connected Accounts</h2>
      </div>

      {items.length === 0 ? (
        <div className="mb-4">
          <p className="text-gray-500 text-sm mb-4">
            No bank accounts connected yet. Link a bank to automatically sync balances.
          </p>
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          {items.map((item) => {
            const itemAccounts = accounts.filter((a) => a.plaid_item_id === item.id)

            return (
              <div
                key={item.id}
                className={`bg-gray-800/50 border border-gray-700 rounded-lg p-4 ${
                  deletingId === item.id ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-white font-medium text-sm">
                      {item.institution_name ?? 'Connected Institution'}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      Last synced: {formatDate(item.last_synced_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDisconnect(item.id, item.institution_name)}
                    disabled={isPending}
                    className="text-gray-500 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>

                {itemAccounts.length > 0 && (
                  <div className="divide-y divide-gray-700">
                    {itemAccounts.map((acct) => (
                      <div key={acct.id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-white text-sm">{acct.name}</p>
                          <p className="text-gray-500 text-xs">
                            {acct.type}{acct.subtype ? ` · ${acct.subtype}` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          {acct.balance_current != null && (
                            <p className="text-white text-sm font-medium">
                              {formatCurrency(acct.balance_current)}
                            </p>
                          )}
                          {acct.balance_available != null && (
                            <p className="text-gray-500 text-xs">
                              Available: {formatCurrency(acct.balance_available)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <PlaidLinkButton isConfigured={isPlaidConfigured} />
    </div>
  )
}
