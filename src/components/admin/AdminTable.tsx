import type { Entry } from "@/lib/queries";
import { EmptyState } from "../EmptyState";
import { EntryRow } from "./EntryRow";

export function AdminTable({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) return <EmptyState showManageLink={false} />;

  return (
    <div className="table-wrap">
      <table className="data-table data-table--admin">
        <caption className="visually-hidden">All count entries</caption>
        <thead>
          <tr>
            <th scope="col">Count</th>
            <th scope="col">Person</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            // Key includes amount/person so the row resets its local state after an edit.
            <EntryRow key={`${e.id}-${e.person}-${e.amount}`} entry={e} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
