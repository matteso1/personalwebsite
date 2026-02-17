import { supabase } from './supabaseClient.js';

const EMAIL_DOMAIN = 'cubesmash.game';

function toEmail(username) {
  return `${username.toLowerCase().trim()}@${EMAIL_DOMAIN}`;
}

export async function signUp(username, password) {
  if (!supabase) return { error: { message: 'Supabase not configured' } };
  const { data, error } = await supabase.auth.signUp({
    email: toEmail(username),
    password,
    options: {
      data: { display_name: username.trim() },
    },
  });
  return { data, error };
}

export async function signIn(username, password) {
  if (!supabase) return { error: { message: 'Supabase not configured' } };
  const { data, error } = await supabase.auth.signInWithPassword({
    email: toEmail(username),
    password,
  });
  return { data, error };
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe() {} } } };
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}

export function getDisplayName(user) {
  return user?.user_metadata?.display_name || 'UNKNOWN';
}
