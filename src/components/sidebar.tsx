'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/net-worth', label: 'Net Worth', icon: '💰' },
  { href: '/dashboard/debt-destroyer', label: 'Debt Destroyer', icon: '⚡' },
  { href: '/dashboard/cash-flow', label: 'Cash Flow', icon: '💸' },
  { href: '/dashboard/documents', label: 'Documents', icon: '📄' },
  { href: '/dashboard/planning', label: 'Planning', icon: '🎯' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white">Family Money Manager</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
            {user.email?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-gray-300 truncate">{user.email}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-sm text-gray-400 hover:text-white py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors text-left cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
