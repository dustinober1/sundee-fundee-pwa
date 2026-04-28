import Link from "next/link";

const footerSections = [
  {
    title: "Explore",
    links: [
      { href: "/app", label: "App" },
      { href: "/about", label: "About" },
      { href: "/workout-plans", label: "Plans" },
      { href: "/blog", label: "Blog" },
      { href: "/science", label: "Science" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/strength-training-for-women", label: "Women" },
      { href: "/strength-training-recovery", label: "Recovery" },
      { href: "/lifting-with-injuries", label: "Injuries" },
      { href: "/wearables-and-strength-training", label: "Wearables" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/donate", label: "Support" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 text-sm text-muted md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start md:gap-10">
          <div className="max-w-xs space-y-2.5">
            <p className="font-display text-lg font-semibold text-navy">
              Sundee Fundee
            </p>
            <p className="text-sm leading-6">
              Recovery-aware strength training for women who want a smarter way
              to lift.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-3 md:gap-x-10">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy/65">
                  {section.title}
                </p>
                <nav className="flex flex-col gap-2">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="leading-5 transition-colors hover:text-navy"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border/80 pt-4 text-xs text-muted/80 md:mt-10 md:pt-5">
          <p>© 2026 Sundee Fundee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
