-- ────────────────────────────────────────────────────────────────
-- 0003_update_motd.sql — refresh /etc/motd and /etc/readme to match
-- the real shell verbs (no leading colon).
-- ────────────────────────────────────────────────────────────────

update public.fs_files
set content = $txt$
welcome to nilsh — a small public guestbook filesystem.

anyone can write a single file under /home/<handle>/<filename>.
files are immutable once written. be brief, be kind, be weird.

  ls [path]                  list a directory
  cd <path>                  change directory  ( .. and ~ work )
  cat <path>                 read a file
  vim <path>                 open the editor — i to insert, esc, :wq to save
  tree                       list every file
  find <substr>              search paths
  graph                      open the obsidian-style graph
  whoami                     who am i?
  help                       full reference

— n.m.
$txt$
where path = '/etc/motd';

update public.fs_files
set content = $txt$
rules

1. one file per path. files are immutable. pick a new name to add more.
2. paths must match /home/<handle>/<filename>. lowercase, dashes ok.
3. 4096 characters max per file. 32 chars max for handles, 64 for filenames.
4. nothing illegal, nothing targeting a person, no spam links. i moderate
   on sight.

if you want yours removed, mail me.
$txt$
where path = '/etc/readme';
