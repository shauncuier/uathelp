create extension if not exists pgcrypto;

do $$
begin
  create type public.user_role as enum ('student', 'moderator', 'admin', 'super_admin');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text not null default 'Student',
  avatar_url text,
  role public.user_role not null default 'student',
  is_verified boolean not null default false,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null,
  location text not null,
  description text,
  website text,
  logo_url text,
  min_gpa numeric,
  seat_count integer,
  established_year integer,
  ranking integer,
  is_featured boolean not null default false,
  programs jsonb not null default '[]'::jsonb,
  admission_deadline date,
  exam_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admission_circulars (
  id uuid primary key default gen_random_uuid(),
  university_id uuid references public.universities(id) on delete set null,
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  image_url text,
  deadline date,
  exam_date date,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image text,
  category text not null,
  author_name text not null default 'UAT Help',
  reading_time text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_universities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  university_id uuid not null references public.universities(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, university_id)
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null check (item_type in ('blog', 'circular')),
  slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, slug)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'New conversation',
  model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_messages (
  id bigserial primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  parts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_question_cache (
  id bigserial primary key,
  normalized_question text unique not null,
  question text not null,
  answer_markdown text not null,
  answer_source text not null default 'model',
  model text,
  hit_count integer not null default 0,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id bigserial primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Role-based permissions table
create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role public.user_role not null unique,
  can_create_post boolean default false,
  can_edit_post boolean default false,
  can_delete_post boolean default false,
  can_moderate_comments boolean default false,
  can_manage_users boolean default false,
  can_manage_universities boolean default false,
  can_access_analytics boolean default false,
  max_daily_chat_queries integer default 50,
  created_at timestamptz not null default now()
);

-- Insert default permissions
insert into public.role_permissions (role, can_create_post, can_edit_post, can_delete_post, can_moderate_comments, can_manage_users, can_manage_universities, can_access_analytics, max_daily_chat_queries)
values 
  ('student', false, false, false, false, false, false, false, 50),
  ('moderator', true, true, false, true, false, false, true, 200),
  ('admin', true, true, true, true, true, true, true, 500),
  ('super_admin', true, true, true, true, true, true, true, 1000)
on conflict (role) do nothing;

create index if not exists universities_type_idx on public.universities(type);
create index if not exists universities_location_idx on public.universities(location);
create index if not exists conversations_user_id_idx on public.conversations(user_id, updated_at desc);
create index if not exists conversation_messages_conversation_id_idx on public.conversation_messages(conversation_id, created_at);
create index if not exists chat_question_cache_last_used_at_idx on public.chat_question_cache(last_used_at desc);

alter table public.profiles enable row level security;
alter table public.saved_universities enable row level security;
alter table public.bookmarks enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.universities enable row level security;
alter table public.admission_circulars enable row level security;
alter table public.blog_posts enable row level security;

drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles
  for select to authenticated
  using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "profiles_self_write" on public.profiles;
create policy "profiles_self_write" on public.profiles
  for update to authenticated
  using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "profiles_self_insert" on public.profiles;
create policy "profiles_self_insert" on public.profiles
  for insert to authenticated
  with check (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "universities_read" on public.universities;
create policy "universities_read" on public.universities
  for select to anon, authenticated
  using (true);

drop policy if exists "cirulars_read" on public.admission_circulars;
create policy "circulars_read" on public.admission_circulars
  for select to anon, authenticated
  using (true);

drop policy if exists "blog_read" on public.blog_posts;
create policy "blog_read" on public.blog_posts
  for select to anon, authenticated
  using (true);

drop policy if exists "saved_uni_own_rows" on public.saved_universities;
create policy "saved_uni_own_rows" on public.saved_universities
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "bookmarks_own_rows" on public.bookmarks;
create policy "bookmarks_own_rows" on public.bookmarks
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "conversations_own_rows" on public.conversations;
create policy "conversations_own_rows" on public.conversations
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "conversation_messages_own_rows" on public.conversation_messages;
create policy "conversation_messages_own_rows" on public.conversation_messages
  for all to authenticated
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  );

grant usage on schema public to anon, authenticated;
grant select on public.universities, public.admission_circulars, public.blog_posts to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.saved_universities, public.bookmarks, public.conversations, public.conversation_messages to authenticated;
