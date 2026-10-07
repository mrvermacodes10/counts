"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { counts } from "@/db/schema";
import { formatNumber } from "@/lib/format";
import { PERSON_NAME } from "@/lib/people";
import { parseAmount, parseId, parsePerson } from "@/lib/validation";

export type FieldErrors = { person?: string; amount?: string };

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

const DB_ERROR = "The database didn't respond, so nothing was saved. Try again.";

function refreshAllPages() {
  // Every page reads totals, so refresh the whole site.
  revalidatePath("/", "layout");
}

function validateEntry(formData: FormData) {
  const person = parsePerson(formData.get("person"));
  const amount = parseAmount(formData.get("amount"));
  const fieldErrors: FieldErrors = {};
  if (!person.ok) fieldErrors.person = person.error;
  if (!amount.ok) fieldErrors.amount = amount.error;
  if (!person.ok || !amount.ok) {
    return { ok: false as const, fieldErrors };
  }
  return { ok: true as const, person: person.value, amount: amount.value };
}

export async function addCount(formData: FormData): Promise<ActionResult> {
  const input = validateEntry(formData);
  if (!input.ok) {
    return { ok: false, error: "Fix the highlighted fields.", fieldErrors: input.fieldErrors };
  }

  try {
    // created_at is set by the database at the moment of insert.
    await getDb().insert(counts).values({ person: input.person, amount: input.amount });
  } catch (err) {
    console.error("addCount failed", err);
    return { ok: false, error: DB_ERROR };
  }

  refreshAllPages();
  return {
    ok: true,
    message: `Added +${formatNumber(input.amount)} for ${PERSON_NAME[input.person]}.`,
  };
}

export async function updateCount(formData: FormData): Promise<ActionResult> {
  const id = parseId(formData.get("id"));
  if (!id.ok) return { ok: false, error: id.error };

  const input = validateEntry(formData);
  if (!input.ok) {
    return { ok: false, error: "Fix the highlighted fields.", fieldErrors: input.fieldErrors };
  }

  let updated: { id: number }[];
  try {
    // created_at is deliberately left alone: editing never changes when a count happened.
    updated = await getDb()
      .update(counts)
      .set({ person: input.person, amount: input.amount, updatedAt: sql`now()` })
      .where(eq(counts.id, id.value))
      .returning({ id: counts.id });
  } catch (err) {
    console.error("updateCount failed", err);
    return { ok: false, error: DB_ERROR };
  }

  if (updated.length === 0) {
    refreshAllPages();
    return { ok: false, error: "This entry no longer exists. It may have been deleted." };
  }

  refreshAllPages();
  return { ok: true, message: "Entry updated." };
}

export async function deleteCount(formData: FormData): Promise<ActionResult> {
  const id = parseId(formData.get("id"));
  if (!id.ok) return { ok: false, error: id.error };

  let deleted: { id: number }[];
  try {
    deleted = await getDb()
      .delete(counts)
      .where(eq(counts.id, id.value))
      .returning({ id: counts.id });
  } catch (err) {
    console.error("deleteCount failed", err);
    return { ok: false, error: DB_ERROR };
  }

  refreshAllPages();
  if (deleted.length === 0) {
    return { ok: false, error: "This entry was already deleted." };
  }
  return { ok: true, message: "Entry deleted." };
}
