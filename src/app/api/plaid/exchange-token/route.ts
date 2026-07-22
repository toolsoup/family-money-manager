import { createClient } from '@/lib/supabase/server'
import { getPlaidClient, isPlaidConfigured } from '@/lib/plaid'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  if (!isPlaidConfigured()) {
    return NextResponse.json({ error: 'Plaid is not configured' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { public_token, institution } = await request.json()
  if (!public_token) {
    return NextResponse.json({ error: 'Missing public_token' }, { status: 400 })
  }

  const client = getPlaidClient()!

  try {
    // Exchange public token for access token
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token,
    })
    const { access_token, item_id } = exchangeResponse.data

    // Insert Plaid item
    const { data: plaidItem, error: itemError } = await supabase
      .from('plaid_items')
      .insert({
        user_id: user.id,
        plaid_item_id: item_id,
        access_token,
        institution_id: institution?.institution_id ?? null,
        institution_name: institution?.name ?? null,
        last_synced_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (itemError) {
      return NextResponse.json({ error: itemError.message }, { status: 500 })
    }

    // Fetch accounts and balances
    const accountsResponse = await client.accountsBalanceGet({
      access_token,
    })

    const accounts = accountsResponse.data.accounts.map((account) => ({
      user_id: user.id,
      plaid_item_id: plaidItem.id,
      plaid_account_id: account.account_id,
      name: account.name,
      official_name: account.official_name ?? null,
      type: account.type,
      subtype: account.subtype ?? null,
      balance_current: account.balances.current ?? null,
      balance_available: account.balances.available ?? null,
      currency_code: account.balances.iso_currency_code ?? 'USD',
      last_synced_at: new Date().toISOString(),
    }))

    if (accounts.length > 0) {
      const { error: accountsError } = await supabase
        .from('plaid_accounts')
        .insert(accounts)

      if (accountsError) {
        console.error('Error inserting plaid accounts:', accountsError)
      }
    }

    return NextResponse.json({ success: true, item_id: plaidItem.id })
  } catch (err) {
    console.error('Error exchanging token:', err)
    return NextResponse.json({ error: 'Failed to exchange token' }, { status: 500 })
  }
}
