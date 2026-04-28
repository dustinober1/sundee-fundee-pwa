import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AppScreen, NavItem } from "./types";

export function AppShell(props: {
  navItems: NavItem[];
  screen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  statusLabel: string;
  screenTitle: string;
  onQuickLog: () => void;
  children: ReactNode;
}) {
  const {
    navItems,
    screen,
    onNavigate,
    statusLabel,
    screenTitle,
    onQuickLog,
    children,
  } = props;

  return (
    <main className="h-dvh overflow-hidden bg-[#f6f2e4] text-navy">
      <div className="mx-auto grid h-dvh max-w-7xl md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-border bg-cream/75 px-4 py-5 md:flex md:flex-col">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/Logo.jpeg"
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px] rounded-full object-cover"
            />
            <span className="font-display text-xl font-semibold">Sundee</span>
          </Link>
          <nav className="mt-10 grid gap-2 text-sm font-semibold">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`rounded-lg px-3 py-2 text-left transition ${
                  screen === item.id
                    ? "bg-navy text-cream"
                    : "text-muted hover:bg-navy/5 hover:text-navy"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <Link
            href="/donate"
            className="mt-auto rounded-lg bg-orange px-4 py-2 text-center text-sm font-semibold text-cream"
          >
            Donate
          </Link>
        </aside>

        <section className="grid h-dvh grid-rows-[auto_1fr_auto] overflow-hidden">
          <header className="border-b border-border bg-cream/90 px-5 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange">
                  {statusLabel}
                </p>
                <h1 className="font-display text-3xl font-semibold">{screenTitle}</h1>
              </div>
              <button
                type="button"
                onClick={onQuickLog}
                className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-cream md:hidden"
              >
                Log
              </button>
            </div>
          </header>

          <div className="overflow-y-auto px-5 py-5">{children}</div>

          <nav className="grid grid-cols-5 border-t border-border bg-cream/95 px-2 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-muted backdrop-blur md:hidden">
            {navItems
              .filter((item) => item.id !== "recovery")
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`rounded-lg px-1 py-2 ${
                    screen === item.id ? "bg-navy text-cream" : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
