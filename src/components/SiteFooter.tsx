import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <p className="font-display text-base font-semibold text-navy">
          Sundee Fundee
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/about" className="hover:text-navy">
            About Us
          </Link>
          <Link href="/donate" className="hover:text-navy">
            Support
          </Link>
          <Link href="/blog" className="hover:text-navy">
            Blog
          </Link>
          <Link href="/science" className="hover:text-navy">
            The Science
          </Link>
          <Link href="/roadmap" className="hover:text-navy">
            Roadmap
          </Link>
          <Link href="/faq" className="hover:text-navy">
            FAQ
          </Link>
          <Link href="/privacy" className="hover:text-navy">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-navy">
            Terms
          </Link>
        </div>
        <p>© 2026 Sundee Fundee. All rights reserved.</p>
      </div>
    </footer>
  );
}
