import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Pseudo-Unix filesystem backed by the `fs_files` table.
 * Visitors can write into /home/<handle>/<filename>; files are immutable.
 */

export function isFsConfigured() {
  return isSupabaseConfigured;
}

export function normalizePath(p) {
  if (!p) return "/";
  let out = p.trim();
  if (!out.startsWith("/")) out = "/" + out;
  out = out.replace(/\/+/g, "/");
  if (out.length > 1 && out.endsWith("/")) out = out.slice(0, -1);
  return out;
}

export function dirname(p) {
  const n = normalizePath(p);
  if (n === "/") return "/";
  const i = n.lastIndexOf("/");
  return i <= 0 ? "/" : n.slice(0, i);
}

export function basename(p) {
  const n = normalizePath(p);
  if (n === "/") return "";
  return n.slice(n.lastIndexOf("/") + 1);
}

export function isGuestPath(p) {
  return /^\/home\/[a-z0-9_-]{1,32}\/[a-z0-9._-]{1,64}$/.test(normalizePath(p));
}

export function extractHandle(p) {
  const m = normalizePath(p).match(/^\/home\/([a-z0-9_-]+)\//);
  return m ? m[1] : null;
}

// in-memory cache of the file index. invalidated on writes/deletes and on
// `vim:saved` events so the shell can do `ls` without a round-trip every time.
let _indexCache = null;
let _indexAt = 0;
const INDEX_TTL_MS = 30_000;

function invalidateIndex() {
  _indexCache = null;
  _indexAt = 0;
}

if (typeof window !== "undefined") {
  window.addEventListener("vim:saved", invalidateIndex);
}

export async function listAll({ force = false } = {}) {
  if (!isSupabaseConfigured) return [];
  const fresh = _indexCache && Date.now() - _indexAt < INDEX_TTL_MS;
  if (!force && fresh) return _indexCache;
  const { data, error } = await supabase
    .from("fs_files")
    .select("path, author, created_at")
    .order("path", { ascending: true });
  if (error) throw error;
  _indexCache = data || [];
  _indexAt = Date.now();
  return _indexCache;
}

export function refreshIndex() {
  return listAll({ force: true });
}

/**
 * Returns the immediate children of a directory.
 *   { dirs: ["alice", "bob"], files: [{path, author, created_at}, ...] }
 */
export async function lsDir(dir) {
  const d = normalizePath(dir);
  const all = await listAll();
  const prefix = d === "/" ? "/" : d + "/";

  const dirs = new Set();
  const files = [];

  for (const row of all) {
    if (!row.path.startsWith(prefix)) continue;
    const rest = row.path.slice(prefix.length);
    if (!rest) continue;
    const slash = rest.indexOf("/");
    if (slash === -1) {
      files.push(row);
    } else {
      dirs.add(rest.slice(0, slash));
    }
  }
  return {
    dirs: [...dirs].sort(),
    files: files.sort((a, b) => a.path.localeCompare(b.path)),
  };
}

export async function readFile(path) {
  if (!isSupabaseConfigured) return null;
  const p = normalizePath(path);
  const { data, error } = await supabase
    .from("fs_files")
    .select("*")
    .eq("path", p)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

/**
 * Write a file. Auth is required (RLS enforces it server-side).
 * The DB trigger sets `author` from the JWT — we intentionally don't pass it.
 * The path must match /home/<your-github-handle>/<filename>; admin can write anywhere.
 */
export async function writeFile({ path, content }) {
  if (!isSupabaseConfigured) throw new Error("filesystem offline");
  const p = normalizePath(path);
  if (!content || !content.trim()) throw new Error("E: empty buffer");
  if (content.length > 4096) throw new Error(`E: file too large (${content.length}/4096)`);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("E: not signed in (run `signin` to write files)");

  const { data, error } = await supabase
    .from("fs_files")
    .insert({ path: p, content })   // author set by trigger
    .select()
    .single();
  if (error) {
    if (error.code === "23505") throw new Error(`E: ${p} already exists`);
    if (error.code === "42501" || /row-level security/i.test(error.message)) {
      throw new Error(`E: write denied — your home is /home/${(user.user_metadata?.user_name || "").toLowerCase()}/`);
    }
    throw new Error(error.message || "write failed");
  }
  invalidateIndex();
  return data;
}

export async function rmFile(path) {
  if (!isSupabaseConfigured) throw new Error("filesystem offline");
  const p = normalizePath(path);
  const { error } = await supabase.from("fs_files").delete().eq("path", p);
  if (error) throw error;
  invalidateIndex();
}
