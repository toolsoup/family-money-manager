import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Toaster } from 'sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-neutral-300)' }}>
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto" style={{ padding: 'var(--space-6)' }}>
        {children}
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg)',
            border: '1px solid var(--color-divider)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
            boxShadow: 'var(--shadow-md)',
          },
        }}
      />
    </div>
  )
}
