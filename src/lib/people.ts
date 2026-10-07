export const PEOPLE = ["NEEL", "NISHIL"] as const;
export type Person = (typeof PEOPLE)[number];

export const PERSON_NAME: Record<Person, string> = {
  NEEL: "Neel",
  NISHIL: "Nishil",
};

export const PERSON_PATH: Record<Person, string> = {
  NEEL: "/neel",
  NISHIL: "/nishil",
};

export function isPerson(value: unknown): value is Person {
  return typeof value === "string" && (PEOPLE as readonly string[]).includes(value);
}

/** Session cookie that remembers "Who are you?" for this browsing session. */
export const PERSON_COOKIE = "counts_person";
