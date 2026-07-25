'use client'

import { useState, useCallback } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/navigation'

interface Props {
  isConfigured: boolean
}

export function PlaidLinkButton({ isConfigured }: Props) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function fetchLinkToken() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/plaid/create-link-token', { method: 'POST' })
      const data = await res.json()
      if (data.link_token) {
        setLinkToken(data.link_token)
      } else {
        setError(data.error ?? 'Failed to initialize Plaid')
      }
    } catch {
      setError('Failed to connect to server')
    }
    setIsLoading(false)
  }

  const onSuccess = useCallback(async (publicToken: string, metadata: { institution?: { institution_id: string; name: string } | null }) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/plaid/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_token: publicToken,
          institution: metadata.institution,
        }),
      })
      const data = await res.json()
      if (data.success) {
        router.refresh()
      } else {
        setError(data.error ?? 'Failed to link account')
      }
    } catch {
      setError('Failed to connect to server')
    }
    setIsLoading(false)
    setLinkToken(null)
  }, [router])

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit: () => setLinkToken(null),
  })

  // Auto-open Plaid Link when token is ready
  if (linkToken && ready) {
    open()
  }

  if (!isConfigured) {
    return (
      <div className="card">
        <p style={{ margin: 0 }}>
          Set up Plaid to automatically sync bank accounts. Add{' '}
          <code style={{ color: 'var(--color-accent-700)' }}>PLAID_CLIENT_ID</code> and{' '}
          <code style={{ color: 'var(--color-accent-700)' }}>PLAID_SECRET</code> environment
          variables to get started.
        </p>
        <p className="text-muted" style={{ margin: 0, fontSize: '13px' }}>
          Sign up at plaid.com — the sandbox environment is free.
        </p>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <p
          className="amt-warn"
          style={{
            marginBottom: 'var(--space-3)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent-2-100)',
            fontSize: '14px',
          }}
        >
          {error}
        </p>
      )}
      <button
        onClick={fetchLinkToken}
        disabled={isLoading}
        className="btn btn-primary"
      >
        <svg viewBox="0 0 256 256" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
        </svg>
        {isLoading ? 'Connecting...' : 'Connect Bank Account'}
      </button>
    </div>
  )
}
