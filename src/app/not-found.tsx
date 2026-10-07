import Link from "next/link";

export default function NotFound() {
  return (
    <main className="picker">
      <div className="picker__inner">
        <p className="picker__wordmark">COUNTS</p>
        <h1 className="picker__question">Page not found</h1>
        <nav className="picker__links" aria-label="Pages">
          <Link href="/neel">Neel</Link>
          <Link href="/nishil">Nishil</Link>
          <Link href="/neel-nishil">Neel + Nishil</Link>
        </nav>
      </div>
    </main>
  );
}
