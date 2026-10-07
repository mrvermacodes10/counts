export default function Loading() {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="skeleton skeleton--hero" />
      <div className="skeleton skeleton--heading" />
      <div className="skeleton skeleton--row" />
      <div className="skeleton skeleton--row" />
      <div className="skeleton skeleton--row" />
      <span className="visually-hidden">Loading counts…</span>
    </div>
  );
}
