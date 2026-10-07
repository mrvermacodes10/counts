import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { counts } from "@/db/schema";
import { formatDate, formatTime } from "./format";
import type { Person } from "./people";

export type Totals = { NEEL: number; NISHIL: number; combined: number };

/** Plain, serialisable entry ready for display (safe to pass to client components). */
export type Entry = {
  id: number;
  person: Person;
  amount: number;
  createdAt: string;
  date: string;
  time: string;
  edited: boolean;
};

/** Sums every record in one query. Combined is derived from the same result. */
export async function getTotals(): Promise<Totals> {
  const rows = await getDb()
    .select({
      person: counts.person,
      total: sql<string>`coalesce(sum(${counts.amount}), 0)::bigint`,
    })
    .from(counts)
    .groupBy(counts.person);

  const totals: Totals = { NEEL: 0, NISHIL: 0, combined: 0 };
  for (const row of rows) totals[row.person] = Number(row.total);
  totals.combined = totals.NEEL + totals.NISHIL;
  return totals;
}

/** Newest first. Pass a person to filter. */
export async function getEntries(person?: Person): Promise<Entry[]> {
  const db = getDb();
  const base = db.select().from(counts);
  const rows = await (person ? base.where(eq(counts.person, person)) : base).orderBy(
    desc(counts.createdAt),
    desc(counts.id),
  );

  return rows.map((r) => ({
    id: r.id,
    person: r.person,
    amount: r.amount,
    createdAt: r.createdAt.toISOString(),
    date: formatDate(r.createdAt),
    time: formatTime(r.createdAt),
    edited: r.updatedAt.getTime() - r.createdAt.getTime() > 1000,
  }));
}
