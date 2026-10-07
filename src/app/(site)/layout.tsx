import { Header } from "@/components/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <Header />
      <main className="container site-main">{children}</main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <span className="site-footer__brand">COUNTS</span>
          <span>Times shown in India Standard Time.</span>
        </div>
      </footer>
    </div>
  );
}
