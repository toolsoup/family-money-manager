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
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <p className="text-gray-400 text-sm">
          Set up Plaid to automatically sync bank accounts. Add <code className="text-blue-400">PLAID_CLIENT_ID</code> and <code className="text-blue-400">PLAID_SECRET</code> environment variables to get started.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Sign up at plaid.com — the sandbox environment is free.
        </p>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <p className="text-red-400 text-sm mb-3 bg-red-400/10 p-3 rounded-lg">{error}</p>
      )}
      <button
        onClick={fetchLinkToken}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
      >
        {isLoading ? 'Connecting...' : '+ Connect Bank Account'}
      </button>
    </div>
  )
}
