# Project Status — Family Money Manager

## Completed Phases

### Phase 0: Foundation and Deploy
- [x] GitHub repo created: toolsoup/family-money-manager
- [x] Next.js App Router + TypeScript + Tailwind scaffolded
- [x] Supabase project created: `bywxfevfscsknfjgaxmk` (us-east-1)
- [x] Supabase Auth wiring with middleware for protected routes
- [x] Base schema migration: profiles (with auto-create trigger) + audit_log, both with RLS
- [x] App shell with sidebar: Dashboard, Net Worth, Debt Destroyer, Cash Flow, Documents, Planning, Settings
- [x] Login page with Google OAuth button
- [x] Auth callback route for code exchange
- [x] .env.example and README
- [x] Google OAuth provider configured in Supabase
- [x] Netlify continuous deploy live at https://family-money-manager.netlify.app

### Phase 1: Net Worth and Manual Accounts
- [x] `accounts` table with RLS
- [x] Add/edit/delete accounts (assets and liabilities)
- [x] Net Worth page with total assets, liabilities, and net worth cards
- [x] Dashboard summary cards pulling from accounts data

### Phase 2: Debt Destroyer
- [x] Debt Destroyer page with 6 payoff strategies (Avalanche, Snowball, Hybrid, Highest Payment, Custom, Minimum Only)
- [x] Strategy comparison cards with debt-free timeline and total interest
- [x] Extra monthly payment input
- [x] Line of Credit account type support

### Phase 3: Cash Flow
- [x] `cash_flow_entries` and `savings_goals` tables with RLS
- [x] Income and expense tracking with frequency normalization (weekly/biweekly/monthly/annual)
- [x] Expense breakdown pie chart (Recharts)
- [x] Savings goals with progress bars and time-to-goal estimates

### Phase 4: Documents
- [x] `documents` table with RLS
- [x] Supabase Storage bucket (`documents`, private, 10MB limit)
- [x] Storage RLS policies (user-scoped file paths)
- [x] File upload with metadata (name, category, tags, notes)
- [x] 13 document categories (Real Estate, Personal Finance, General)
- [x] Category filter pills
- [x] View/download via signed URLs
- [x] Edit metadata and delete (file + row)

## Current Phase

**Phase 5** — Planning and projections.

## Upcoming Phases

- **Phase 5:** Planning and projections
- **Phase 6:** Plaid sandbox sync
- **Phase 7:** Productization hardening

## Key References

- **Live URL:** https://family-money-manager.netlify.app
- **Supabase Dashboard:** https://supabase.com/dashboard/project/bywxfevfscsknfjgaxmk
- **GitHub Repo:** https://github.com/toolsoup/family-money-manager
- **GCP Project (OAuth):** re101-492700
- **Supabase Callback URL:** https://bywxfevfscsknfjgaxmk.supabase.co/auth/v1/callback

## Open Questions

None currently.
