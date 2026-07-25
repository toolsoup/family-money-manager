import { createClient } from '@/lib/supabase/server'
import { getUserPreferences, getPlaidItems, getPlaidAccounts } from '@/lib/queries'
import { isPlaidConfigured } from '@/lib/plaid'
import { SettingsProfile } from '@/components/settings-profile'
import { ConnectedAccounts } from '@/components/connected-accounts'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [preferences, plaidItems, plaidAccounts] = await Promise.all([
    getUserPreferences(),
    getPlaidItems(),
    getPlaidAccounts(),
  ])

  const fullName = (user?.user_metadata?.full_name as string) ?? null
  const avatarUrl = (user?.user_metadata?.avatar_url as string) ?? (user?.user_metadata?.picture as string) ?? null

  return (
    <div
      className="sheet"
      style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-8) var(--space-8)',
      }}
    >
      <h1 style={{ margin: '0 0 var(--space-2)' }}>Settings</h1>
      <p className="text-muted" style={{ maxWidth: '40rem' }}>
        Manage your profile, preferences, and connected accounts.
      </p>

      <SettingsProfile
        email={user?.email ?? ''}
        fullName={fullName}
        avatarUrl={avatarUrl}
        preferences={preferences}
      />

      <ConnectedAccounts
        items={plaidItems}
        accounts={plaidAccounts}
        isPlaidConfigured={isPlaidConfigured()}
      />
    </div>
  )
}
