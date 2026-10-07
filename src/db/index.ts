import "server-only";
import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;

// Reuse one client across hot reloads (dev) and warm invocations (Vercel).
const globalForDb = globalThis as unknown as { __countsDb?: Db };

/** Lazily connects so builds don't need a database. */
export function getDb(): Db {
  if (globalForDb.__countsDb) return globalForDb.__countsDb;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add it to your environment variables.");
  }

  const client = postgres(url, {
    max: 3,
    // Required for pooled (PgBouncer) connections such as Neon's "-pooler" URL.
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  globalForDb.__countsDb = drizzle(client, { schema });
  return globalForDb.__countsDb;
}
