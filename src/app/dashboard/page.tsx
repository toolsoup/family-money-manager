import { getNetWorthSummary } from '@/lib/queries'
import { formatCurrency } from '@/lib/format'
import Link from 'next/link'

export default async function DashboardPage() {
  const { totalAssets, totalLiabilities, netWorth, accountCount } = await getNetWorthSummary()

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">Your complete financial overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Total Assets</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalAssets)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Total Liabilities</p>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(totalLiabilities)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Net Worth</p>
          <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-white' : 'text-red-400'}`}>
            {formatCurrency(netWorth)}
          </p>
        </div>
      </div>

      {accountCount === 0 && (
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Getting Started</h2>
          <p className="text-gray-400 mb-4">
            Add your accounts in the Net Worth section to start tracking your financial picture.
            Future phases will unlock Debt Destroyer, Cash Flow tracking, Document analysis, and more.
          </p>
          <Link
            href="/dashboard/net-worth"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add Your First Account
          </Link>
        </div>
      )}
    </div>
  )
}
