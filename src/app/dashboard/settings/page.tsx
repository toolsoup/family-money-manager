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
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
      <p className="text-gray-400 mb-8">Manage your profile, preferences, and connected accounts.</p>

      <div className="space-y-6">
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
    </div>
  )
}
