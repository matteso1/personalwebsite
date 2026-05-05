-- ────────────────────────────────────────────────────────────────
-- 0005_auth_only.sql — switch the guest filesystem to auth-only writes.
--
-- Every visitor signs in with GitHub. Their handle is their GitHub
-- username, set server-side from auth.jwt(). Anonymous writes are
-- removed. The admin (matteso1) can still write anywhere.
-- ────────────────────────────────────────────────────────────────

-- the lowercased GitHub handle of the currently authenticated user
create or replace function public.auth_handle()
returns text language sql stable as $$
  select lower(coalesce(
    (select auth.jwt() -> 'user_metadata' ->> 'user_name'),
    (select auth.jwt() -> 'user_metadata' ->> 'preferred_username'),
    ''
  ));
$$;

-- replace the legacy guest insert policy with an auth-required one
drop policy if exists "fs guest insert" on public.fs_files;
drop policy if exists "fs auth insert"  on public.fs_files;
create policy "fs auth insert"
  on public.fs_files for insert
  with check (
    public.is_site_admin()
    or (
      auth.uid() is not null
      and public.auth_handle() <> ''
      and path ~ ('^/home/' || public.auth_handle() || '/[a-z0-9._-]{1,64}$')
    )
  );

-- force `author` to come from the JWT, not the client. admin can still
-- override (e.g. seeding /etc/* as some other name) by passing a value.
create or replace function public.fs_files_set_author()
returns trigger language plpgsql as $$
begin
  if public.is_site_admin() then
    new.author := coalesce(new.author, public.auth_handle(), 'admin');
  else
    new.author := public.auth_handle();
  end if;
  return new;
end;
$$;

drop trigger if exists fs_files_author_trg on public.fs_files;
create trigger fs_files_author_trg
  before insert on public.fs_files
  for each row execute function public.fs_files_set_author();
