import { useState, useEffect, useCallback } from 'react';
import { signUp, signIn, signOut, getSession, onAuthChange, getDisplayName } from '../services/authService.js';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });

    const { data } = onAuthChange((session) => {
      setUser(session?.user || null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const register = useCallback(async (username, password) => {
    const { data, error } = await signUp(username, password);
    if (error) return { error };
    // Auto-login after registration (Supabase does this when email confirm is off)
    return { data };
  }, []);

  const login = useCallback(async (username, password) => {
    const { data, error } = await signIn(username, password);
    if (error) return { error };
    return { data };
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  const isLoggedIn = !!user;
  const displayName = user ? getDisplayName(user) : null;

  return { user, isLoggedIn, displayName, authLoading, login, register, logout };
}
