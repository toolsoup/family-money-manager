export type AccountType =
  | 'checking'
  | 'savings'
  | 'credit_card'
  | 'mortgage'
  | 'investment'
  | 'vehicle'
  | 'property'
  | 'line_of_credit'
  | 'other'

export interface Account {
  id: string
  user_id: string
  name: string
  type: AccountType
  balance: number
  institution: string | null
  notes: string | null
  is_asset: boolean
  interest_rate: number | null
  minimum_payment: number | null
  created_at: string
  updated_at: string
}

export interface DebtAccount {
  id: string
  name: string
  balance: number
  interest_rate: number
  minimum_payment: number
}

export type PayoffStrategyType =
  | 'avalanche'
  | 'snowball'
  | 'hybrid'
  | 'highest_payment'
  | 'custom'
  | 'minimum_only'

export const ASSET_TYPES: AccountType[] = ['checking', 'savings', 'investment', 'vehicle', 'property']
export const LIABILITY_TYPES: AccountType[] = ['credit_card', 'mortgage', 'line_of_credit']

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  checking: 'Checking',
  savings: 'Savings',
  credit_card: 'Credit Card',
  mortgage: 'Mortgage',
  investment: 'Investment',
  vehicle: 'Vehicle',
  property: 'Property',
  line_of_credit: 'Line of Credit',
  other: 'Other',
}

export function isAssetType(type: AccountType): boolean {
  return ASSET_TYPES.includes(type)
}

export function isLiabilityType(type: AccountType): boolean {
  return LIABILITY_TYPES.includes(type)
}
