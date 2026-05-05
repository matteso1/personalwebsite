import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const isSupabaseConfigured = !!supabase;

export const ADMIN_GITHUB_USERNAME = "matteso1";

export function isAdmin(user) {
  if (!user) return false;
  const username = (user.user_metadata?.user_name || user.user_metadata?.preferred_username || "").toLowerCase();
  return username === ADMIN_GITHUB_USERNAME;
}
