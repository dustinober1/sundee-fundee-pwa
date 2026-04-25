import {
  APP_STORE_URL,
  SITE_OG_IMAGE_PATH,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

export const siteImageUrl = SITE_OG_IMAGE_PATH;

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

export function siteOgImageUrl(): string {
  return absoluteUrl(SITE_OG_IMAGE_PATH);
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_TITLE,
    url: SITE_URL,
    logo: absoluteUrl("/Logo.jpeg"),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE,
    url: SITE_URL,
  };
}

export function buildSoftwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_TITLE,
    applicationCategory: "HealthApplication",
    operatingSystem: "iOS",
    url: SITE_URL,
    image: siteOgImageUrl(),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      url: APP_STORE_URL,
    },
    description:
      "Recovery-aware strength training for iPhone, with readiness, injury-aware training choices, cycle-aware context, and progress tracking.",
  };
}

export function buildFaqPageJsonLd(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildItemListJsonLd(
  name: string,
  items: Array<{ name: string; url: string; description?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url,
      name: item.name,
      description: item.description,
    })),
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
