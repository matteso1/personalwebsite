-- ────────────────────────────────────────────────────────────────
-- 0006_motd_auth.sql — refresh /etc/motd to teach the GitHub auth
-- flow that replaced `nick`.
-- ────────────────────────────────────────────────────────────────

update public.fs_files
set content = $txt$
welcome to nilsh — a small public guestbook filesystem.

every visitor signs in with github and gets /home/<gh-username>/.
files are immutable once written. be brief, be weird.

how to leave a mark
  signin                     sign in with github
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
