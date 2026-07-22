-- Add default timeframe preference to profiles
alter table public.profiles add column if not exists default_timeframe integer not null default 5;

-- Plaid items (one per connected institution)
create table public.plaid_items (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  plaid_item_id    text not null,
  access_token     text not null,
  institution_id   text,
  institution_name text,
  status           text not null default 'active',
  last_synced_at   timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.plaid_items enable row level security;

create policy "Users can view own plaid items"
  on public.plaid_items for select using (auth.uid() = user_id);

create policy "Users can insert own plaid items"
  on public.plaid_items for insert with check (auth.uid() = user_id);

create policy "Users can update own plaid items"
  on public.plaid_items for update using (auth.uid() = user_id);

create policy "Users can delete own plaid items"
  on public.plaid_items for delete using (auth.uid() = user_id);

create trigger plaid_items_updated_at
  before update on public.plaid_items
  for each row execute function public.set_updated_at();

-- Plaid accounts (synced from Plaid per item)
create table public.plaid_accounts (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  plaid_item_id      uuid not null references public.plaid_items(id) on delete cascade,
  plaid_account_id   text not null,
  name               text not null,
  official_name      text,
  type               text not null,
  subtype            text,
  balance_current    numeric,
  balance_available  numeric,
  currency_code      text default 'USD',
  last_synced_at     timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.plaid_accounts enable row level security;

create policy "Users can view own plaid accounts"
  on public.plaid_accounts for select using (auth.uid() = user_id);

create policy "Users can insert own plaid accounts"
  on public.plaid_accounts for insert with check (auth.uid() = user_id);

create policy "Users can update own plaid accounts"
  on public.plaid_accounts for update using (auth.uid() = user_id);

create policy "Users can delete own plaid accounts"
  on public.plaid_accounts for delete using (auth.uid() = user_id);

create trigger plaid_accounts_updated_at
  before update on public.plaid_accounts
  for each row execute function public.set_updated_at();
