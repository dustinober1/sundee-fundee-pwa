"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { buildAppStoreUrl } from "@/lib/app-store-links";

type Props = {
  showHomeLink?: boolean;
  showDownloadButtons?: boolean;
};

export function SiteHeader({
  showHomeLink = false,
  showDownloadButtons = false,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const navLinks = (
    <>
      {showHomeLink ? (
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-sm font-medium text-navy hover:opacity-70"
        >
          Home
        </Link>
      ) : null}
      <Link
        href="/workout-plans"
        onClick={() => setOpen(false)}
        className="text-sm font-medium text-navy hover:opacity-70"
      >
        Plans
      </Link>
      <Link
        href="/blog"
        onClick={() => setOpen(false)}
        className="text-sm font-medium text-navy hover:opacity-70"
      >
        Blog
      </Link>
      <Link
        href="/tools"
        onClick={() => setOpen(false)}
        className="text-sm font-medium text-navy hover:opacity-70"
      >
        Tools
      </Link>
      <Link
        href="/science"
        onClick={() => setOpen(false)}
        className="text-sm font-medium text-navy hover:opacity-70"
      >
        The Science
      </Link>
      <Link
        href="/roadmap"
        onClick={() => setOpen(false)}
        className="text-sm font-medium text-navy hover:opacity-70"
      >
        Roadmap
      </Link>
      <Link
        href="/faq"
        onClick={() => setOpen(false)}
        className="text-sm font-medium text-navy hover:opacity-70"
      >
        FAQ
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/Logo.jpeg"
            alt="Sundee Fundee"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-display text-xl font-semibold text-navy">
            Sundee Fundee
          </span>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {navLinks}
          {showDownloadButtons ? (
            <a
              href={buildAppStoreUrl({ campaign: "site_header", content: "desktop_download" })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track("app_store_click", {
                  campaign: "site_header",
                  content: "desktop_download",
                });
              }}
              className="inline-flex h-10 items-center rounded-lg bg-orange px-5 text-sm font-medium text-cream hover:opacity-90"
            >
              Download
            </a>
          ) : null}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy hover:bg-navy/5 md:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-border bg-cream px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {navLinks}
            {showDownloadButtons ? (
              <a
                href={buildAppStoreUrl({ campaign: "site_header", content: "mobile_download" })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track("app_store_click", {
                    campaign: "site_header",
                    content: "mobile_download",
                  });
                  setOpen(false);
                }}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-orange px-5 text-sm font-medium text-cream hover:opacity-90"
              >
                Download
              </a>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
