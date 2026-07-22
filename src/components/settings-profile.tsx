'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  async function handleSavePreferences(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setSaved(false)

    const formData = new FormData(e.currentTarget)
    const result = await updatePreferences(formData)

    setIsPending(false)
    if (result.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {(fullName ?? email)?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            {fullName && <p className="text-white font-medium">{fullName}</p>}
            <p className="text-gray-400 text-sm">{email}</p>
            <p className="text-gray-600 text-xs mt-1">Signed in with Google</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>
        <form onSubmit={handleSavePreferences}>
          <div className="mb-4">
            <label htmlFor="pref-timeframe" className="block text-sm text-gray-400 mb-1">
              Default Projection Timeframe
            </label>
            <select
              id="pref-timeframe"
              name="default_timeframe"
              defaultValue={preferences.default_timeframe}
              className="w-full max-w-xs bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {PROJECTION_TIMEFRAMES.map((t) => (
                <option key={t} value={t}>{t} {t === 1 ? 'Year' : 'Years'}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
          >
            {isPending ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
          </button>
        </form>
      </div>

      {/* Sign Out */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Account</h2>
        <p className="text-gray-500 text-sm mb-4">Sign out of your account on this device.</p>
        <button
          onClick={handleSignOut}
          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
