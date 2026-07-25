'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
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
      const result = await disconnectPlaidItem(itemId)
      if (result.success) {
        toast.success('Account disconnected')
      } else {
        toast.error(result.error ?? 'Failed to disconnect')
      }
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
    <section style={{ marginTop: 'var(--space-8)' }}>
      <h3 style={{ margin: '0 0 var(--space-3)' }}>Connected Accounts</h3>

      {items.length === 0 ? (
        <p className="text-muted" style={{ maxWidth: '40rem', marginBottom: 'var(--space-4)' }}>
          No bank accounts connected yet. Link a bank to automatically sync balances.
        </p>
      ) : (
        <div className="flex flex-col" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          {items.map((item) => {
            const itemAccounts = accounts.filter((a) => a.plaid_item_id === item.id)

            return (
              <div
                key={item.id}
                className="card"
                style={deletingId === item.id ? { opacity: 0.5 } : undefined}
              >
                <div className="flex items-center justify-between" style={{ gap: 'var(--space-3)' }}>
                  <div>
                    <p className="card-title" style={{ margin: 0 }}>
                      {item.institution_name ?? 'Connected Institution'}
                    </p>
                    <p className="text-muted" style={{ margin: '2px 0 0', fontSize: '12px' }}>
                      Last synced: {formatDate(item.last_synced_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDisconnect(item.id, item.institution_name)}
                    disabled={isPending}
                    className="btn btn-danger"
                  >
                    Disconnect
                  </button>
                </div>

                {itemAccounts.length > 0 && (
                  <div>
                    {itemAccounts.map((acct) => (
                      <div
                        key={acct.id}
                        className="flex items-center justify-between"
                        style={{
                          gap: 'var(--space-3)',
                          padding: 'var(--space-2) 0',
                          borderTop: '1px solid var(--color-divider)',
                        }}
                      >
                        <div>
                          <p style={{ margin: 0 }}>{acct.name}</p>
                          <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>
                            {acct.type}{acct.subtype ? ` · ${acct.subtype}` : ''}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          {acct.balance_current != null && (
                            <p className="tnum" style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                              {formatCurrency(acct.balance_current)}
                            </p>
                          )}
                          {acct.balance_available != null && (
                            <p className="text-muted tnum" style={{ margin: 0, fontSize: '12px' }}>
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
    </section>
  )
}
