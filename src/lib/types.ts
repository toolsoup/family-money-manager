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

// --- Cash Flow ---

export type CashFlowType = 'income' | 'expense'
export type CashFlowFrequency = 'weekly' | 'biweekly' | 'monthly' | 'annual'

export const INCOME_CATEGORIES = ['Salary', 'Side Hustle', 'Rental Income', 'Investments', 'Other'] as const
export const EXPENSE_CATEGORIES = ['Housing', 'Utilities', 'Insurance', 'Groceries', 'Transportation', 'Dining', 'Entertainment', 'Subscriptions', 'Healthcare', 'Education', 'Personal', 'Debt Payments', 'Savings', 'Other'] as const

export const FREQUENCY_LABELS: Record<CashFlowFrequency, string> = {
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  annual: 'Annual',
}

export interface CashFlowEntry {
  id: string
  user_id: string
  name: string
  type: CashFlowType
  category: string
  amount: number
  frequency: CashFlowFrequency
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// --- Documents ---

export type DocumentCategory =
  | 'Closing Docs'
  | 'Property Records'
  | 'Loan Documents'
  | 'Contracts/Leases'
  | 'Appraisals'
  | 'Tax Returns'
  | 'Bank Statements'
  | 'Insurance Policies'
  | 'Pay Stubs'
  | 'Investment Statements'
  | 'Receipts'
  | 'Legal'
  | 'Other'

export const DOCUMENT_CATEGORIES = [
  'Closing Docs',
  'Property Records',
  'Loan Documents',
  'Contracts/Leases',
  'Appraisals',
  'Tax Returns',
  'Bank Statements',
  'Insurance Policies',
  'Pay Stubs',
  'Investment Statements',
  'Receipts',
  'Legal',
  'Other',
] as const

export const DOCUMENT_CATEGORY_GROUPS: Record<string, readonly DocumentCategory[]> = {
  'Real Estate': ['Closing Docs', 'Property Records', 'Loan Documents', 'Contracts/Leases', 'Appraisals'],
  'Personal Finance': ['Tax Returns', 'Bank Statements', 'Insurance Policies', 'Pay Stubs', 'Investment Statements', 'Receipts'],
  'General': ['Legal', 'Other'],
}

export interface Document {
  id: string
  user_id: string
  name: string
  category: DocumentCategory
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  notes: string | null
  tags: string[] | null
  uploaded_at: string
  updated_at: string
}
