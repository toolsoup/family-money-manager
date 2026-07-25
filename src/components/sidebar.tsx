'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

// Plain-language labels from the design system's dashboard nav.
const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/net-worth', label: 'What we own' },
  { href: '/dashboard/debt-destroyer', label: 'Pay off debt' },
  { href: '/dashboard/cash-flow', label: 'Money in and out' },
  { href: '/dashboard/planning', label: 'Goals' },
  { href: '/dashboard/documents', label: 'Documents' },
  { href: '/dashboard/settings', label: 'Settings' },
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
    <aside
      className="flex flex-col"
      style={{
        width: '260px',
        background: 'var(--color-bg)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{ padding: 'var(--space-6) var(--space-4) var(--space-4)' }}>
        <span className="nav-brand" style={{ fontSize: '20px' }}>Family Money</span>
      </div>

      <nav className="flex-1 flex flex-col" style={{ padding: '0 var(--space-3)', gap: '2px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              style={{
                display: 'block',
                padding: '9px var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-heading)',
                fontSize: '15px',
                textDecoration: 'none',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                background: isActive ? 'var(--color-accent-100)' : 'transparent',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-divider)' }}>
        <div className="flex items-center" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: '32px', height: '32px', flex: 'none', borderRadius: '50%',
              background: 'var(--color-accent-100)', color: 'var(--color-accent-800)',
              fontFamily: 'var(--font-heading)', fontSize: '13px',
            }}
          >
            {user.email?.[0]?.toUpperCase()}
          </div>
          <span className="text-muted truncate" style={{ fontSize: '13px' }}>{user.email}</span>
        </div>
        <button onClick={handleSignOut} className="btn btn-secondary btn-block" type="button">
          Sign out
        </button>
      </div>
    </aside>
  )
}
