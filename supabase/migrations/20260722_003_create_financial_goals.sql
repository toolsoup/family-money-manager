-- Financial goals for the Planning page
create table public.financial_goals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  category      text not null,
  target_value  numeric not null,
  current_value numeric not null default 0,
  target_date   date,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.financial_goals enable row level security;

create policy "Users can view own goals"
  on public.financial_goals for select using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on public.financial_goals for insert with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.financial_goals for update using (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.financial_goals for delete using (auth.uid() = user_id);

create trigger financial_goals_updated_at
  before update on public.financial_goals
  for each row execute function public.set_updated_at();
