import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <p className="font-display text-base font-semibold text-navy">
          Sundee Fundee
        </p>
        <div className="flex gap-6">
          <Link href="/blog" className="hover:text-navy">
            Blog
          </Link>
          <Link href="/privacy" className="hover:text-navy">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-navy">
            Terms
          </Link>
        </div>
        <p>© 2026 Sundee Fundee. Public site.</p>
      </div>
    </footer>
  );
}
