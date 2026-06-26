import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';
import courtsRouter from './routes/courts.js';
import bookingsRouter from './routes/bookings.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const isProd = process.env.NODE_ENV === 'production';

// Better Auth handler MUST be mounted before express.json()
app.all('/api/auth/*', toNodeHandler(auth));

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/courts', courtsRouter);
app.use('/api/bookings', bookingsRouter);

// In production, serve the Vite build and handle SPA routing
if (isProd) {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(join(distPath, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
