import { sql } from "drizzle-orm";
import { check, index, integer, pgEnum, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export const personEnum = pgEnum("person", ["NEEL", "NISHIL"]);

/**
 * One row per count entry. Totals are never stored; they are always
 * summed from these rows, so they can't drift out of sync.
 */
export const counts = pgTable(
  "counts",
  {
    id: serial("id").primaryKey(),
    person: personEnum("person").notNull(),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Last line of defence: the database itself rejects zero/negative counts.
    check("counts_amount_positive", sql`${t.amount} > 0`),
    index("counts_created_at_idx").on(t.createdAt),
    index("counts_person_idx").on(t.person),
  ],
);

export type CountRow = typeof counts.$inferSelect;
