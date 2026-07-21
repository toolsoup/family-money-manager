-- Documents table for storing financial document metadata
create table public.documents (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  category     text not null,
  file_name    text not null,
  file_path    text not null,
  file_size    bigint not null,
  file_type    text not null,
  notes        text,
  tags         text[],
  uploaded_at  timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- RLS
alter table public.documents enable row level security;

create policy "Users can view own documents"
  on public.documents for select using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on public.documents for insert with check (auth.uid() = user_id);

create policy "Users can update own documents"
  on public.documents for update using (auth.uid() = user_id);

create policy "Users can delete own documents"
  on public.documents for delete using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

-- Storage bucket policies (bucket must be created via dashboard: name=documents, private, 10MB limit)
-- These policies go on storage.objects:

-- Allow authenticated users to upload to their own folder
create policy "Users can upload own documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to read their own files
create policy "Users can read own documents"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own files
create policy "Users can delete own documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
