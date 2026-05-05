-- ────────────────────────────────────────────────────────────────
-- 0001_init.sql — posts table + RLS for the personal site blog
--
-- Run this once in the Supabase SQL editor. After running:
--   1) enable the GitHub provider in Auth → Providers
--      (callback URL: https://<project>.supabase.co/auth/v1/callback)
--   2) sign in once on the site so a row appears in auth.users
--      with user_metadata.user_name = 'matteso1'
--   3) every subsequent edit / publish flows through the policies below
-- ────────────────────────────────────────────────────────────────

create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  subtitle      text,
  summary       text,
  content       text not null,
  tags          text[] not null default '{}',
  read_time     text,
  github_url    text,
  demo_url      text,
  published     boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists posts_published_at_idx
  on public.posts (published_at desc)
  where published = true;

-- updated_at maintained automatically
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- ── Row-level security ─────────────────────────────────────────
alter table public.posts enable row level security;

-- helper: is the current request the admin (matteso1 on github)?
create or replace function public.is_site_admin()
returns boolean language sql stable as $$
  select coalesce(
    (auth.jwt() -> 'user_metadata' ->> 'user_name') = 'matteso1',
    false
  );
$$;

-- public can read published posts only
drop policy if exists "posts read published"     on public.posts;
create policy "posts read published"
  on public.posts for select
  using (published = true);

-- the admin can read everything, including drafts
drop policy if exists "posts admin read all"     on public.posts;
create policy "posts admin read all"
  on public.posts for select
  using (public.is_site_admin());

drop policy if exists "posts admin insert"       on public.posts;
create policy "posts admin insert"
  on public.posts for insert
  with check (public.is_site_admin());

drop policy if exists "posts admin update"       on public.posts;
create policy "posts admin update"
  on public.posts for update
  using (public.is_site_admin())
  with check (public.is_site_admin());

drop policy if exists "posts admin delete"       on public.posts;
create policy "posts admin delete"
  on public.posts for delete
  using (public.is_site_admin());
