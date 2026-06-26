import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  // In dev, Vite proxies /api to Express on :3001 — needs the explicit origin.
  // In production, frontend and API share the same origin so no baseURL needed.
  baseURL: import.meta.env.DEV ? 'http://localhost:5173' : undefined,
});
