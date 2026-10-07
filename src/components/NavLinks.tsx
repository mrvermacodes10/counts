"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/neel", label: "Neel" },
  { href: "/nishil", label: "Nishil" },
  { href: "/neel-nishil", label: "Neel + Nishil" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="main-nav__list">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={active ? "main-nav__link is-active" : "main-nav__link"}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ManageLink() {
  const pathname = usePathname();
  const active = pathname.startsWith("/admin");
  return (
    <Link
      href="/admin"
      className={active ? "manage-link is-active" : "manage-link"}
      aria-current={active ? "page" : undefined}
    >
      Manage Counts
    </Link>
  );
}
