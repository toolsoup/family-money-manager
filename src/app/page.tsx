import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main style={{ background: 'transparent', minHeight: '100vh' }}>
      <div
        className="sheet"
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: 'var(--space-8) var(--space-8) var(--space-8)',
        }}
      >
        <header style={{ maxWidth: '46rem', margin: 'var(--space-8) 0' }}>
          <h6 className="badge" style={{ margin: '0 0 var(--space-3)' }}>
            Family Money Manager
          </h6>
          <h1 style={{ margin: '0 0 var(--space-4)', fontSize: '56px', lineHeight: 1.02 }}>
            Your whole financial picture, on one page.
          </h1>
          <p
            className="text-muted"
            style={{ margin: '0 0 var(--space-6)', fontSize: '18px', maxWidth: '38rem' }}
          >
            Track what you own and owe, plan your goals, and destroy debt — a calm,
            clear ledger for the whole household.
          </p>
          <Link href="/auth/login" className="btn btn-primary">
            Sign in to get started
          </Link>
        </header>

        <hr className="hr" />

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-8)',
            marginTop: 'var(--space-8)',
            alignItems: 'start',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 var(--space-2)' }}>Net worth</h3>
            <p className="text-muted" style={{ margin: 0 }}>
              See everything you own and owe come together in a single number.
            </p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 var(--space-2)' }}>Money in and out</h3>
            <p className="text-muted" style={{ margin: 0 }}>
              Follow every dollar each month so nothing slips through the cracks.
            </p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 var(--space-2)' }}>Pay off debt</h3>
            <p className="text-muted" style={{ margin: 0 }}>
              Build a payoff plan and watch the balances fall, one by one.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
