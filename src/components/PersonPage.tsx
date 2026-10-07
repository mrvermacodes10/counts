import { formatNumber } from "@/lib/format";
import { PERSON_NAME, type Person } from "@/lib/people";
import { getEntries, getTotals } from "@/lib/queries";
import { CountTable } from "./CountTable";
import { SectionHeading, entriesLabel } from "./SectionHeading";

export async function PersonPage({ person }: { person: Person }) {
  const [totals, entries] = await Promise.all([getTotals(), getEntries(person)]);
  const name = PERSON_NAME[person];

  return (
    <>
      <section className={`scoreboard scoreboard--${person.toLowerCase()}`} aria-label={`${name} total`}>
        <h1 className="scoreboard__name">{name}</h1>
        <div className="scoreboard__total">
          <span className="scoreboard__label">Total</span>
          <span className="scoreboard__value">{formatNumber(totals[person])}</span>
        </div>
      </section>

      <section className="section">
        <SectionHeading title="History" detail={entriesLabel(entries.length)} />
        <CountTable entries={entries} caption={`${name}'s count history`} />
      </section>
    </>
  );
}
