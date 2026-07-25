'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { updatePreferences } from '@/app/dashboard/settings/actions'
import { PROJECTION_TIMEFRAMES } from '@/lib/types'
import type { UserPreferences } from '@/lib/types'

interface Props {
  email: string
  fullName: string | null
  avatarUrl: string | null
  preferences: UserPreferences
}

export function SettingsProfile({ email, fullName, avatarUrl, preferences }: Props) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSavePreferences(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const result = await updatePreferences(formData)

    setIsPending(false)
    if (result.success) {
      toast.success('Preferences saved')
    } else {
      toast.error(result.error ?? 'Failed to save preferences')
    }
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <>
      {/* Profile */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <h3 style={{ margin: '0 0 var(--space-3)' }}>Profile</h3>
        <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              style={{ width: '64px', height: '64px', borderRadius: '50%', flex: 'none' }}
            />
          ) : (
            <div
              className="flex items-center justify-center"
              style={{
                width: '64px', height: '64px', flex: 'none', borderRadius: '50%',
                background: 'var(--color-accent-100)', color: 'var(--color-accent-800)',
                fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '26px',
              }}
            >
              {(fullName ?? email)?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            {fullName && (
              <p style={{ margin: '0 0 2px', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '18px' }}>
                {fullName}
              </p>
            )}
            <p style={{ margin: '0 0 2px' }}>{email}</p>
            <p className="text-muted" style={{ margin: 0, fontSize: '13px' }}>Signed in with Google</p>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <h3 style={{ margin: '0 0 var(--space-3)' }}>Preferences</h3>
        <form onSubmit={handleSavePreferences}>
          <div className="field" style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ marginBottom: 'var(--space-2)' }}>Default Projection Timeframe</label>
            <div className="seg">
              {PROJECTION_TIMEFRAMES.map((t) => (
                <label key={t} className="seg-opt">
                  <input
                    type="radio"
                    name="default_timeframe"
                    value={t}
                    defaultChecked={t === preferences.default_timeframe}
                  />
                  <span>{t} {t === 1 ? 'Year' : 'Years'}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={isPending} className="btn btn-primary">
            {isPending ? 'Saving...' : 'Save Preferences'}
          </button>
        </form>
      </section>

      {/* Sign Out */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <h3 style={{ margin: '0 0 var(--space-2)' }}>Account</h3>
        <p className="text-muted" style={{ marginBottom: 'var(--space-3)' }}>
          Sign out of your account on this device.
        </p>
        <button onClick={handleSignOut} className="btn btn-secondary" type="button">
          Sign Out
        </button>
      </section>
    </>
  )
}
