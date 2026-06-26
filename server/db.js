import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set — add it to the .env file in the project root.');
}

export const sql = neon(process.env.DATABASE_URL);
