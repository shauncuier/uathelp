-- Add missing tables and columns for email verification and new features

-- Verification tokens table
create table if not exists public.verification_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  email text not null,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Admin audit logs table (should already exist, but ensure it's present)
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- Update blog_posts table to include author_id and is_published
alter table public.blog_posts
add column if not exists author_id uuid references public.profiles(id) on delete set null,
add column if not exists is_published boolean not null default false,
add column if not exists featured_image text,
add column if not exists tags text[] default '{}';

-- Update universities table with missing fields
alter table public.universities
add column if not exists image_url text,
add column if not exists admission_email text,
add column if not exists phone text,
add column if not exists total_students integer,
add column if not exists acceptance_rate numeric,
add column if not exists is_public boolean not null default true;

-- Create indexes for better performance
create index if not exists idx_verification_tokens_user_id on public.verification_tokens(user_id);
create index if not exists idx_verification_tokens_token on public.verification_tokens(token);
create index if not exists idx_admin_audit_logs_actor_id on public.admin_audit_logs(actor_id);
create index if not exists idx_admin_audit_logs_created_at on public.admin_audit_logs(created_at);
create index if not exists idx_admin_audit_logs_entity on public.admin_audit_logs(entity_type, entity_id);
create index if not exists idx_saved_universities_user_id on public.saved_universities(user_id);
create index if not exists idx_saved_universities_university_id on public.saved_universities(university_id);
create index if not exists idx_blog_posts_author_id on public.blog_posts(author_id);
create index if not exists idx_blog_posts_published on public.blog_posts(is_published);
create index if not exists idx_conversations_user_id on public.conversations(user_id);
create index if not exists idx_conversations_created_at on public.conversations(created_at);

-- RLS policies for new tables
alter table public.verification_tokens enable row level security;
drop policy if exists "verification_tokens_own" on public.verification_tokens;
create policy "verification_tokens_own" on public.verification_tokens
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

alter table public.admin_audit_logs enable row level security;
drop policy if exists "audit_logs_admin_read" on public.admin_audit_logs;
create policy "audit_logs_admin_read" on public.admin_audit_logs
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "audit_logs_admin_write" on public.admin_audit_logs;
create policy "audit_logs_admin_write" on public.admin_audit_logs
  for insert to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'super_admin')));

-- Update blog posts RLS to include author write access
alter table public.blog_posts enable row level security;
drop policy if exists "blog_edit_author" on public.blog_posts;
create policy "blog_edit_author" on public.blog_posts
  for update to authenticated
  using (author_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('moderator', 'admin', 'super_admin')))
  with check (author_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('moderator', 'admin', 'super_admin')));

drop policy if exists "blog_delete_author" on public.blog_posts;
create policy "blog_delete_author" on public.blog_posts
  for delete to authenticated
  using (author_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('moderator', 'admin', 'super_admin')));

drop policy if exists "blog_insert_moderator" on public.blog_posts;
create policy "blog_insert_moderator" on public.blog_posts
  for insert to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('moderator', 'admin', 'super_admin')));

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.verification_tokens to authenticated;
grant select, insert, update, delete on public.admin_audit_logs to authenticated;
