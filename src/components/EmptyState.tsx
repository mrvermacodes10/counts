import Link from "next/link";

export function EmptyState({ showManageLink = true }: { showManageLink?: boolean }) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">No counts yet.</p>
      {showManageLink && (
        <p className="empty-state__hint">
          Add the first one in <Link href="/admin">Manage Counts</Link>.
        </p>
      )}
    </div>
  );
}
