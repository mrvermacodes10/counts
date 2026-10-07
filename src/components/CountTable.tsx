import { formatNumber } from "@/lib/format";
import type { Entry } from "@/lib/queries";
import { EmptyState } from "./EmptyState";
import { PersonName } from "./PersonName";

export function CountTable({ entries, caption }: { entries: Entry[]; caption: string }) {
  if (entries.length === 0) return <EmptyState />;

  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Count</th>
            <th scope="col">Name</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className={`row--${e.person.toLowerCase()}`}>
              <td className="cell-count">+{formatNumber(e.amount)}</td>
              <td>
                <PersonName person={e.person} />
              </td>
              <td className="cell-muted">
                <time dateTime={e.createdAt}>{e.date}</time>
              </td>
              <td className="cell-muted">{e.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
