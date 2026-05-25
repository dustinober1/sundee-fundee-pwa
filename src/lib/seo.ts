import {
  APP_STORE_URL,
  SITE_OG_IMAGE_PATH,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";
import type { AuthorProfile } from "./authors";

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
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildSoftwareApplicationJsonLd() {
  return buildEnhancedSoftwareApplicationJsonLd();
}

export function buildEnhancedSoftwareApplicationJsonLd(
  overrides: Record<string, unknown> = {},
) {
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
    ...overrides,
  };
}

export function buildWebPageJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_TITLE,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };
}

export function buildWorkoutPlanJsonLd({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url,
    image,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
    isAccessibleForFree: true,
    encodingFormat: "application/pdf",
  };
}

export function buildBlogPostingJsonLd({
  post,
  url,
  author,
}: {
  post: {
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    tags: string[];
    sources: Array<{ title: string; url: string; publisher: string }>;
    wordCount: number;
    articleSection: string;
  };
  url: string;
  author: AuthorProfile;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: {
      "@type": "ImageObject",
      url: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
      width: 1200,
      height: 630,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": author.schemaType,
      name: author.name,
      url: absoluteUrl(`/authors/${author.slug}`),
      description: author.description,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/Logo.jpeg"),
      },
    },
    citation: post.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.title,
      url: source.url,
      publisher: {
        "@type": "Organization",
        name: source.publisher,
      },
    })),
    articleSection: post.articleSection,
    inLanguage: "en-US",
    keywords: post.tags.join(", "),
    wordCount: post.wordCount,
  };
}

export function buildProfilePageJsonLd({
  author,
  url,
  relatedArticles,
}: {
  author: AuthorProfile;
  url: string;
  relatedArticles: Array<{ name: string; url: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    name: `${author.name} | ${SITE_TITLE}`,
    description: author.description,
    mainEntity: {
      "@type": author.schemaType,
      name: author.name,
      description: author.description,
      url,
      knowsAbout: author.expertise,
    },
    mainContentOfPage: {
      "@type": "ItemList",
      itemListElement: relatedArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.name,
        url: article.url,
      })),
    },
  };
}

export function buildTrainingToolJsonLd({
  name,
  description,
  url,
  audience,
}: {
  name: string;
  description: string;
  url: string;
  audience: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "StrengthTrainingTool",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern JavaScript-enabled browser",
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
    featureList: audience,
    image: siteOgImageUrl(),
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
