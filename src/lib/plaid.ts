import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID
const PLAID_SECRET = process.env.PLAID_SECRET
const PLAID_ENV = (process.env.PLAID_ENV ?? 'sandbox') as keyof typeof PlaidEnvironments

let _client: PlaidApi | null = null

export function getPlaidClient(): PlaidApi | null {
  if (!PLAID_CLIENT_ID || !PLAID_SECRET) return null

  if (!_client) {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[PLAID_ENV] ?? PlaidEnvironments.sandbox,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
          'PLAID-SECRET': PLAID_SECRET,
        },
      },
    })
    _client = new PlaidApi(configuration)
  }

  return _client
}

export function isPlaidConfigured(): boolean {
  return !!(PLAID_CLIENT_ID && PLAID_SECRET)
}
