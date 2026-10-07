import { isPerson, type Person } from "./people";

// Shared by the browser (instant feedback) and the server (the real gate).

export const MAX_AMOUNT = 1_000_000;

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function parsePerson(raw: unknown): Result<Person> {
  if (raw === null || raw === undefined || raw === "") {
    return { ok: false, error: "Choose a person." };
  }
  const value = String(raw).trim().toUpperCase();
  if (!isPerson(value)) return { ok: false, error: "Person must be Neel or Nishil." };
  return { ok: true, value };
}

export function parseAmount(raw: unknown): Result<number> {
  const text = raw === null || raw === undefined ? "" : String(raw).trim();
  if (text === "") return { ok: false, error: "Enter a count." };
  if (text.startsWith("-")) return { ok: false, error: "Count can't be negative." };
  if (!/^\+?\d+$/.test(text)) {
    return { ok: false, error: "Count must be a whole number, like 1 or 3." };
  }
  const value = Number(text.replace(/^\+/, ""));
  if (value === 0) return { ok: false, error: "Count must be greater than 0." };
  if (!Number.isSafeInteger(value) || value > MAX_AMOUNT) {
    return { ok: false, error: `Count can't be more than ${MAX_AMOUNT.toLocaleString("en-IN")}.` };
  }
  return { ok: true, value };
}

export function parseId(raw: unknown): Result<number> {
  const text = raw === null || raw === undefined ? "" : String(raw).trim();
  if (!/^\d+$/.test(text)) return { ok: false, error: "This entry couldn't be identified." };
  const value = Number(text);
  if (!Number.isSafeInteger(value) || value < 1 || value > 2_147_483_647) {
    return { ok: false, error: "This entry couldn't be identified." };
  }
  return { ok: true, value };
}
