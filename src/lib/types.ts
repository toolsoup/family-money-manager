export type AccountType =
  | 'checking'
  | 'savings'
  | 'credit_card'
  | 'mortgage'
  | 'investment'
  | 'vehicle'
  | 'property'
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
  created_at: string
  updated_at: string
}

export const ASSET_TYPES: AccountType[] = ['checking', 'savings', 'investment', 'vehicle', 'property']
export const LIABILITY_TYPES: AccountType[] = ['credit_card', 'mortgage']

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  checking: 'Checking',
  savings: 'Savings',
  credit_card: 'Credit Card',
  mortgage: 'Mortgage',
  investment: 'Investment',
  vehicle: 'Vehicle',
  property: 'Property',
  other: 'Other',
}

export function isAssetType(type: AccountType): boolean {
  return ASSET_TYPES.includes(type)
}

export function isLiabilityType(type: AccountType): boolean {
  return LIABILITY_TYPES.includes(type)
}
