import { getDebtAccounts } from '@/lib/queries'
import { formatCurrency } from '@/lib/format'
import { DebtDashboard } from '@/components/debt-dashboard'
import Link from 'next/link'

export default async function DebtDestroyerPage() {
  const debts = await getDebtAccounts()

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0)
  const totalMinPayments = debts.reduce((sum, d) => sum + d.minimum_payment, 0)

  if (debts.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Debt Destroyer</h1>
        <p className="text-gray-400 mb-8">Crush your debt with the right strategy.</p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-4xl mb-4">⚡</p>
          <h2 className="text-lg font-semibold text-white mb-2">No debts to destroy yet</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Add liability accounts (credit cards, mortgages) with interest rates and minimum payments
            in the Net Worth section to unlock debt payoff strategies.
          </p>
          <Link
            href="/dashboard/net-worth"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go to Net Worth
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Debt Destroyer</h1>
      <p className="text-gray-400 mb-8">Crush your debt with the right strategy.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Total Debt</p>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(totalDebt)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Debts</p>
          <p className="text-2xl font-bold text-white">{debts.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Total Minimum Payments</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalMinPayments)}/mo</p>
        </div>
      </div>

      <DebtDashboard debts={debts} />
    </div>
  )
}
