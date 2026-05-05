-- ────────────────────────────────────────────────────────────────
-- 0004_motd_v2.sql — teach the `nick` flow so visitors know how to
-- claim a handle and grow their own /home/<name>/ directory.
-- ────────────────────────────────────────────────────────────────

update public.fs_files
set content = $txt$
welcome to nilsh — a small public guestbook filesystem.

every visitor can claim a handle and leave one or more files under
/home/<handle>/. files are immutable once written. be brief, be weird.

how to leave a mark
  nick yourname              claim a handle
  vim ~/hello.txt            open the editor in your home dir
  i                          enter insert mode, type stuff
  esc  →  :wq                write and quit — your file is now public

browsing
  ls /home                   see everyone else's directories
  cat /home/someone/x.txt    read a file
  graph                      open the obsidian-style file graph

— n.m.
$txt$
where path = '/etc/motd';
