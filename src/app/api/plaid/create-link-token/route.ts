import { createClient } from '@/lib/supabase/server'
import { getPlaidClient, isPlaidConfigured } from '@/lib/plaid'
import { NextResponse } from 'next/server'
import { CountryCode, Products } from 'plaid'

export async function POST() {
  if (!isPlaidConfigured()) {
    return NextResponse.json({ error: 'Plaid is not configured' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const client = getPlaidClient()!

  try {
    const response = await client.linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: 'Family Money Manager',
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    })

    return NextResponse.json({ link_token: response.data.link_token })
  } catch (err) {
    console.error('Error creating link token:', err)
    return NextResponse.json({ error: 'Failed to create link token' }, { status: 500 })
  }
}
