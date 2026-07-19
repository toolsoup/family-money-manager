# Family Money Manager

A secure personal finance web app with Debt Destroyer. Track net worth, destroy debt, manage cash flow, analyze documents with AI, and plan your financial future.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Recharts
- **Backend:** Supabase (Postgres, Auth, Storage, RLS)
- **AI:** Anthropic Claude API (server-side only)
- **Banking:** Plaid (sandbox → production)
- **Hosting:** Netlify (continuous deploy from GitHub)

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project
- Google OAuth credentials (GCP Console)

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/toolsoup/family-money-manager.git
   cd family-money-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

4. Run locally:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Phase 0+ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Phase 0+ | Supabase anon/publishable key |
| `ANTHROPIC_API_KEY` | Phase 4+ | Claude API key (server-side only) |
| `PLAID_CLIENT_ID` | Phase 6+ | Plaid client ID |
| `PLAID_SECRET` | Phase 6+ | Plaid secret key |
| `PLAID_ENV` | Phase 6+ | `sandbox` or `production` |

### Supabase Setup

1. Create a Supabase project
2. Enable Google OAuth in Authentication → Providers
3. Add redirect URI to your Google OAuth client: `https://<project-ref>.supabase.co/auth/v1/callback`
4. Migrations are in `supabase/migrations/` — apply via the Supabase dashboard or CLI

## Security

- All API keys and tokens are server-side only
- Row Level Security (RLS) on every table
- Sensitive fields encrypted at rest
- PII redacted before LLM calls
- Private storage bucket with signed URLs
- Audit logging for sensitive actions

## Disclaimer

This tool provides educational estimates only. It is not financial, tax, or investment advice.
