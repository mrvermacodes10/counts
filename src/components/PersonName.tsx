import { PERSON_NAME, type Person } from "@/lib/people";

/** Name with a small marker: solid square for Neel, outlined square for Nishil. */
export function PersonName({ person }: { person: Person }) {
  return (
    <span className="person-name">
      <span className={`person-mark person-mark--${person.toLowerCase()}`} aria-hidden="true" />
      {PERSON_NAME[person]}
    </span>
  );
}
