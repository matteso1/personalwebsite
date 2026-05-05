import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured, isAdmin } from "./supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithGitHub = (redirectPath) => {
    if (!isSupabaseConfigured) return Promise.resolve({ data: null, error: { message: "supabase not configured" } });
    const back = redirectPath || (window.location.pathname + window.location.hash);
    return supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin + back },
    });
  };

  const signOut = () => {
    if (!isSupabaseConfigured) return;
    return supabase.auth.signOut();
  };

  return { user, loading, isAdmin: isAdmin(user), signInWithGitHub, signOut };
}
