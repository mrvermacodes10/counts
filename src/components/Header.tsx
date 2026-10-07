import Link from "next/link";
import { ManageLink, NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__top">
        <Link href="/" className="wordmark" aria-label="COUNTS">
          COUNTS
        </Link>
        <ManageLink />
      </div>
      <nav className="container main-nav" aria-label="Main">
        <NavLinks />
      </nav>
    </header>
  );
}
