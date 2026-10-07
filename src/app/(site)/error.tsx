"use client";

import { useEffect } from "react";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-state" role="alert">
      <h1>Counts couldn&apos;t load</h1>
      <p>The database didn&apos;t respond. Check your connection, then try again.</p>
      <button type="button" className="button button--primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
