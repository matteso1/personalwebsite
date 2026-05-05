import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';

function git(cmd, fallback = '') {
  try { return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); }
  catch { return fallback; }
}

const sha = git('git rev-parse --short HEAD', 'dev');
const builtAt = new Date().toISOString();

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_SHA__: JSON.stringify(sha),
    __BUILT_AT__: JSON.stringify(builtAt),
  },
  server: { open: true },
});
