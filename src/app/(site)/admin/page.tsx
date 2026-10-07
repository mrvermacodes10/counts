import type { Metadata } from "next";
import { AddCountForm } from "@/components/admin/AddCountForm";
import { AdminTable } from "@/components/admin/AdminTable";
import { SectionHeading } from "@/components/SectionHeading";
import { formatNumber } from "@/lib/format";
import { getEntries, getTotals } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Manage Counts", robots: { index: false } };

export default async function AdminPage() {
  const [totals, entries] = await Promise.all([getTotals(), getEntries()]);

  return (
    <>
      <section className="page-intro">
        <h1>Manage Counts</h1>
        <p>Add, edit or delete entries. Totals on every page update automatically.</p>
        <dl className="mini-totals">
          <div>
            <dt>Neel</dt>
            <dd>{formatNumber(totals.NEEL)}</dd>
          </div>
          <div>
            <dt>Nishil</dt>
            <dd>{formatNumber(totals.NISHIL)}</dd>
          </div>
          <div>
            <dt>Combined</dt>
            <dd>{formatNumber(totals.combined)}</dd>
          </div>
        </dl>
      </section>

      <section className="panel" aria-labelledby="add-heading">
        <h2 id="add-heading" className="panel__title">
          Add a count
        </h2>
        <AddCountForm />
      </section>

      <section className="section">
        <SectionHeading
          title="All entries"
          detail={entries.length === 1 ? "1 entry" : `${formatNumber(entries.length)} entries`}
        />
        <AdminTable entries={entries} />
      </section>
    </>
  );
}
