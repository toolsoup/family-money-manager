import { getAccounts } from '@/lib/queries'
import { formatCurrency } from '@/lib/format'
import { AccountList } from '@/components/account-list'

export default async function NetWorthPage() {
  const accounts = await getAccounts()

  const assets = accounts.filter((a) => a.is_asset)
  const liabilities = accounts.filter((a) => !a.is_asset)

  const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0)
  const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0)
  const netWorth = totalAssets - totalLiabilities

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Net Worth</h1>
      <p className="text-gray-400 mb-8">Track your assets and liabilities.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <div className="space-y-6">
        <AccountList
          title="Assets"
          accounts={assets}
          total={totalAssets}
          colorClass="text-green-400"
          defaultType="checking"
        />
        <AccountList
          title="Liabilities"
          accounts={liabilities}
          total={totalLiabilities}
          colorClass="text-red-400"
          defaultType="credit_card"
        />
      </div>
    </div>
  )
}
