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
- [ ] Google OAuth provider configured in Supabase (manual step)
- [ ] Netlify continuous deploy (pending)

## Current Phase

**Phase 0** — finishing deploy and Google OAuth config.

## Upcoming Phases

- **Phase 1:** Net worth and manual accounts
- **Phase 2:** Debt Destroyer (6 payoff strategies)
- **Phase 3:** Cash flow, budget, savings goals
- **Phase 4:** Documents and LLM financial snapshot
- **Phase 5:** Planning and projections
- **Phase 6:** Plaid sandbox sync
- **Phase 7:** Productization hardening

## Key References

- **Supabase Dashboard:** https://supabase.com/dashboard/project/bywxfevfscsknfjgaxmk
- **GitHub Repo:** https://github.com/toolsoup/family-money-manager
- **GCP Project (OAuth):** ai-growth-engine-490100
- **Supabase Callback URL:** https://bywxfevfscsknfjgaxmk.supabase.co/auth/v1/callback

## Open Questions

None currently.
