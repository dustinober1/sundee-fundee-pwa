import Image from "next/image";
import Link from "next/link";
import { APP_STORE_URL } from "@/lib/site";

type Props = {
  showHomeLink?: boolean;
  showDownloadButtons?: boolean;
};

export function SiteHeader({
  showHomeLink = false,
  showDownloadButtons = false,
}: Props) {
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

        <nav className="flex items-center gap-3">
          {showHomeLink ? (
            <Link
              href="/"
              className="text-sm font-medium text-navy hover:opacity-70"
            >
              Home
            </Link>
          ) : null}
          <Link
            href="/blog"
            className="text-sm font-medium text-navy hover:opacity-70"
          >
            Blog
          </Link>
          <Link
            href="/science"
            className="text-sm font-medium text-navy hover:opacity-70"
          >
            The Science
          </Link>
          <Link
            href="/roadmap"
            className="text-sm font-medium text-navy hover:opacity-70"
          >
            Roadmap
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-navy hover:opacity-70"
          >
            FAQ
          </Link>
          {showDownloadButtons ? (
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-lg bg-orange px-5 text-sm font-medium text-cream hover:opacity-90"
            >
              Download
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
