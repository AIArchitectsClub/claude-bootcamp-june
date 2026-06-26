import { sql } from './db.js';

// ── Better Auth tables ───────────────────────────────────────────────────────
// Drop and recreate so column names match what Better Auth's Kysely adapter
// expects (camelCase quoted identifiers, e.g. "emailVerified" not email_verified).
await sql`DROP TABLE IF EXISTS verification`;
await sql`DROP TABLE IF EXISTS account`;
await sql`DROP TABLE IF EXISTS session`;
await sql`DROP TABLE IF EXISTS "user"`;

await sql`
  CREATE TABLE "user" (
    "id"            TEXT        PRIMARY KEY,
    "name"          TEXT        NOT NULL,
    "email"         TEXT        NOT NULL UNIQUE,
    "emailVerified" BOOLEAN     NOT NULL DEFAULT false,
    "image"         TEXT,
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

await sql`
  CREATE TABLE session (
    "id"        TEXT        PRIMARY KEY,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "token"     TEXT        NOT NULL UNIQUE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId"    TEXT        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
  )
`;

await sql`
  CREATE TABLE account (
    "id"                     TEXT        PRIMARY KEY,
    "accountId"              TEXT        NOT NULL,
    "providerId"             TEXT        NOT NULL,
    "userId"                 TEXT        NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "accessToken"            TEXT,
    "refreshToken"           TEXT,
    "idToken"                TEXT,
    "accessTokenExpiresAt"   TIMESTAMPTZ,
    "refreshTokenExpiresAt"  TIMESTAMPTZ,
    "scope"                  TEXT,
    "password"               TEXT,
    "createdAt"              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"              TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

await sql`
  CREATE TABLE verification (
    "id"         TEXT        PRIMARY KEY,
    "identifier" TEXT        NOT NULL,
    "value"      TEXT        NOT NULL,
    "expiresAt"  TIMESTAMPTZ NOT NULL,
    "createdAt"  TIMESTAMPTZ,
    "updatedAt"  TIMESTAMPTZ
  )
`;

// ── App tables ───────────────────────────────────────────────────────────────
const courts = [
  { id: 'c1', name: 'Court 1 – Centre', surface: 'Hard',  indoor: false, lights: true,  pricePerHour: 12, description: 'Main showcase court with spectator seating.' },
  { id: 'c2', name: 'Court 2 – Clay',   surface: 'Clay',  indoor: false, lights: true,  pricePerHour: 10, description: 'Slow red clay surface, ideal for baseline play.' },
  { id: 'c3', name: 'Court 3 – Grass',  surface: 'Grass', indoor: false, lights: false, pricePerHour: 14, description: 'Natural grass, available spring/summer only.' },
  { id: 'c4', name: 'Court 4 – Indoor', surface: 'Hard',  indoor: true,  lights: true,  pricePerHour: 18, description: 'Covered indoor court, available year-round.' },
];

await sql`
  CREATE TABLE IF NOT EXISTS courts (
    id             TEXT PRIMARY KEY,
    name           TEXT    NOT NULL,
    surface        TEXT    NOT NULL,
    indoor         BOOLEAN NOT NULL DEFAULT false,
    lights         BOOLEAN NOT NULL DEFAULT false,
    price_per_hour INTEGER NOT NULL,
    description    TEXT
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS bookings (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    court_id    TEXT        NOT NULL REFERENCES courts(id),
    court_name  TEXT        NOT NULL,
    date        DATE        NOT NULL,
    time        TEXT        NOT NULL,
    duration    INTEGER     NOT NULL DEFAULT 1,
    player_name TEXT        NOT NULL,
    players     INTEGER     NOT NULL DEFAULT 2,
    user_id     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

// Add user_id to existing tables that were created before auth was added
await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id TEXT`;

for (const c of courts) {
  await sql`
    INSERT INTO courts (id, name, surface, indoor, lights, price_per_hour, description)
    VALUES (${c.id}, ${c.name}, ${c.surface}, ${c.indoor}, ${c.lights}, ${c.pricePerHour}, ${c.description})
    ON CONFLICT (id) DO NOTHING
  `;
}

console.log('Database seeded successfully.');
