-- ────────────────────────────────────────────────────────────────
-- 0002_guest_fs.sql — public guest filesystem
--
-- A pseudo-Unix filesystem that anyone can write into, scoped to the
-- /home/<handle>/ namespace. Files are immutable once written. The admin
-- (matteso1) can write anywhere (e.g. /etc/motd, /etc/readme) and can
-- delete any file for moderation.
-- ────────────────────────────────────────────────────────────────

create table if not exists public.fs_files (
  id          uuid primary key default gen_random_uuid(),
  path        text not null unique,
  author      text not null,
  content     text not null,
  created_at  timestamptz not null default now(),
  -- size / shape constraints
  constraint fs_files_path_len check (char_length(path) between 3 and 128),
  constraint fs_files_content_len check (char_length(content) between 1 and 4096),
  constraint fs_files_author_len check (char_length(author) between 1 and 32),
  constraint fs_files_path_shape check (path ~ '^/[a-z0-9._/-]+$'),
  constraint fs_files_path_no_dotdot check (path !~ '\.\.'),
  constraint fs_files_path_starts_clean check (path !~ '//')
);

create index if not exists fs_files_path_idx on public.fs_files (path);
create index if not exists fs_files_created_idx on public.fs_files (created_at desc);

-- ── helper predicates ──────────────────────────────────────────
create or replace function public.is_guest_path(p text)
returns boolean language sql immutable as $$
  -- /home/<handle>/<file>  — handle 1..32, file 1..64
  select p ~ '^/home/[a-z0-9_-]{1,32}/[a-z0-9._-]{1,64}$';
$$;

-- ── RLS ────────────────────────────────────────────────────────
alter table public.fs_files enable row level security;

drop policy if exists "fs read all"     on public.fs_files;
create policy "fs read all"
  on public.fs_files for select
  using (true);

drop policy if exists "fs guest insert" on public.fs_files;
create policy "fs guest insert"
  on public.fs_files for insert
  with check (
    public.is_guest_path(path)
    or public.is_site_admin()
  );

drop policy if exists "fs admin update" on public.fs_files;
create policy "fs admin update"
  on public.fs_files for update
  using (public.is_site_admin())
  with check (public.is_site_admin());

drop policy if exists "fs admin delete" on public.fs_files;
create policy "fs admin delete"
  on public.fs_files for delete
  using (public.is_site_admin());

-- ── seed files (admin-only paths) ──────────────────────────────
insert into public.fs_files (path, author, content) values
  ('/etc/motd',
   'nils',
$txt$
welcome to the guestbook.

this is a small shared filesystem. anyone can leave a file under
/home/<handle>/<filename>. files are immutable once written. be kind,
be brief, be weird.

  :e /home/yourname/hello.txt   open a buffer for a new file
  :w                            write it
  :wq                           write and quit
  :ls /home                     list everyone's directories
  :cat /home/someone/file.txt   read a file
  :tree                         see everything

— n.m.
$txt$),
  ('/etc/readme',
   'nils',
$txt$
rules

1. one file per path. files are immutable. pick a new name to add more.
2. paths must match /home/<handle>/<filename>. lowercase, dashes ok.
3. 4096 characters max per file. 32 chars max for handles, 64 for filenames.
4. nothing illegal, nothing targeting a person, no spam links. i moderate
   on sight.

if you want yours removed, mail me.
$txt$)
on conflict (path) do nothing;
