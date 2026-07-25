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
        width: '256px',
        flex: 'none',
        background: 'var(--color-bg)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center" style={{ gap: '10px', padding: 'var(--space-6) var(--space-4) var(--space-4)' }}>
        <span
          aria-hidden="true"
          style={{
            width: '26px', height: '26px', flex: 'none', borderRadius: '8px',
            background: 'var(--grad-gold)', boxShadow: 'var(--glow-gold)',
          }}
        />
        <span className="nav-brand" style={{ margin: 0, fontSize: '18px' }}>Family Money</span>
      </div>

      <nav className="flex-1 flex flex-col" style={{ padding: 'var(--space-2) var(--space-3)', gap: '3px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              style={{
                display: 'block',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '14.5px',
                textDecoration: 'none',
                color: isActive ? 'var(--color-accent-800)' : 'var(--color-text-dim)',
                background: isActive ? 'var(--color-accent-100)' : 'transparent',
                boxShadow: isActive ? 'inset 2px 0 0 var(--color-accent)' : 'none',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
        <div className="flex items-center" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: '34px', height: '34px', flex: 'none', borderRadius: '50%',
              background: 'var(--color-accent-100)', color: 'var(--color-accent-800)',
              fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px',
              border: '1px solid var(--color-border)',
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
