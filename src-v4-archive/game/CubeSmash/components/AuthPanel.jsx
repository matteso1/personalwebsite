import React, { useState } from 'react';

export default function AuthPanel({ isLoggedIn, displayName, authLoading, onLogin, onRegister, onLogout }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) return null;

  if (isLoggedIn) {
    return (
      <div className="font-mono text-xs flex items-center justify-between gap-2 mb-4">
        <span className="text-terminal-green">LOGGED_IN_AS: {displayName}</span>
        <button
          onClick={onLogout}
          className="border border-terminal text-terminal-muted px-2 py-1 hover:border-terminal-green hover:text-terminal-green transition-colors"
        >
          LOGOUT
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password || submitting) return;
    setError('');
    setSubmitting(true);

    const action = mode === 'register' ? onRegister : onLogin;
    const { error: err } = await action(username.trim(), password);

    if (err) {
      let msg = err.message || 'Something went wrong';
      if (msg.includes('Invalid login')) msg = 'INVALID USERNAME OR PASSWORD';
      else if (msg.includes('already registered') || msg.includes('already been registered')) msg = 'USERNAME ALREADY TAKEN';
      else if (msg.includes('least 6')) msg = 'PASSWORD MUST BE 6+ CHARACTERS';
      else msg = msg.toUpperCase();
      setError(msg);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="font-mono text-xs mb-4">
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => { setMode('login'); setError(''); }}
          className={`px-2 py-1 border transition-colors ${
            mode === 'login'
              ? 'border-terminal-green text-terminal-green'
              : 'border-terminal text-terminal-muted hover:text-terminal-green'
          }`}
        >
          LOGIN
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setError(''); }}
          className={`px-2 py-1 border transition-colors ${
            mode === 'register'
              ? 'border-terminal-green text-terminal-green'
              : 'border-terminal text-terminal-muted hover:text-terminal-green'
          }`}
        >
          REGISTER
        </button>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={16}
          placeholder="USERNAME"
          className="bg-terminal-surface border border-terminal text-terminal-green px-2 py-1 text-xs font-mono focus:outline-none focus:border-terminal-green w-28"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="PASSWORD"
          className="bg-terminal-surface border border-terminal text-terminal-green px-2 py-1 text-xs font-mono focus:outline-none focus:border-terminal-green w-28"
        />
        <button
          type="submit"
          disabled={!username.trim() || !password || submitting}
          className="border border-terminal-green text-terminal-green px-3 py-1 hover:bg-terminal-green/10 transition-colors disabled:opacity-30"
        >
          {submitting ? '...' : mode === 'register' ? 'REGISTER' : 'LOGIN'}
        </button>
      </div>

      {error && (
        <div className="text-red-400 mt-1">{error}</div>
      )}
    </form>
  );
}
