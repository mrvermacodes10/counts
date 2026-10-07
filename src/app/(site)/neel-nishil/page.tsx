import type { Metadata } from "next";
import Link from "next/link";
import { CountTable } from "@/components/CountTable";
import { SectionHeading, entriesLabel } from "@/components/SectionHeading";
import { formatNumber } from "@/lib/format";
import { PEOPLE, PERSON_NAME, PERSON_PATH } from "@/lib/people";
import { getEntries, getTotals } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Neel + Nishil" };

export default async function CombinedPage() {
  const [totals, entries] = await Promise.all([getTotals(), getEntries()]);

  return (
    <>
      <section className="combined" aria-labelledby="combined-heading">
        <div className="combined__main">
          <h1 id="combined-heading" className="combined__label">
            Combined total
          </h1>
          <p className="combined__value">{formatNumber(totals.combined)}</p>
        </div>
        <div className="combined__split">
          {PEOPLE.map((p) => (
            <Link
              key={p}
              href={PERSON_PATH[p]}
              className={`combined__person combined__person--${p.toLowerCase()}`}
            >
              <span className="combined__person-name">
                <span className={`person-mark person-mark--${p.toLowerCase()} person-mark--on-dark`} aria-hidden="true" />
                {PERSON_NAME[p]}
              </span>
              <span className="combined__person-value">{formatNumber(totals[p])}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading title="History" detail={entriesLabel(entries.length)} />
        <CountTable entries={entries} caption="Combined count history for Neel and Nishil" />
      </section>
    </>
  );
}
