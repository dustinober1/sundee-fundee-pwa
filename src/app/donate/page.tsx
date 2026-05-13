import type { Metadata } from "next";
import { DonateForm } from "@/app/donate/DonateForm";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo";
import { SITE_OG_IMAGE_PATH, SITE_TITLE, SITE_URL } from "@/lib/site";

const donateTitle = "Support Sundee Fundee";
const donateDescription =
  "Help keep Sundee Fundee free, ad-free, and subscription-free with a one-time or monthly donation.";

export const metadata: Metadata = {
  title: donateTitle,
  description: donateDescription,
  alternates: {
    canonical: "/donate",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/donate",
    siteName: SITE_TITLE,
    title: donateTitle,
    description: donateDescription,
    images: [SITE_OG_IMAGE_PATH],
  },
  twitter: {
    card: "summary_large_image",
    title: donateTitle,
    description: donateDescription,
    images: [SITE_OG_IMAGE_PATH],
  },
};

export default function DonatePage() {
  const url = absoluteUrl("/donate");

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: donateTitle, url },
          ]),
          buildWebPageJsonLd({
            name: donateTitle,
            description: donateDescription,
            url,
          }),
          {
            "@context": "https://schema.org",
            "@type": "DonateAction",
            name: donateTitle,
            target: url,
            recipient: {
              "@type": "Organization",
              name: SITE_TITLE,
              url: SITE_URL,
            },
          },
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-24">
          <div className="mx-auto max-w-lg">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Support
            </p>
            <h1 className="font-display mt-4 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              Keep it free
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              Sundee Fundee is free, with no ads and no subscription. If it has
              helped your training, a small donation keeps development going and
              the app free for everyone.
            </p>

            <DonateForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
