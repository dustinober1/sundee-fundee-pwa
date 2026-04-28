"use client";

import { APP_STORE_URL } from "@/lib/site";
import { track } from "@vercel/analytics";

type Props = {
  compact?: boolean;
  utmCampaign?: string;
  utmContent?: string;
};

function appStoreUrl({
  utmCampaign,
  utmContent,
}: {
  utmCampaign?: string;
  utmContent?: string;
}) {
  const url = new URL(APP_STORE_URL);
  url.searchParams.set("utm_source", "sundeefundee.com");
  url.searchParams.set("utm_medium", "web");
  url.searchParams.set("utm_term", "app_store");
  if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
  if (utmContent) url.searchParams.set("utm_content", utmContent);
  return url.toString();
}

export function AppStoreButtons({
  compact = false,
  utmCampaign,
  utmContent,
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-8 font-medium transition";
  const size = compact ? "h-10 px-5 text-sm" : "h-12";

  return (
    <a
      href={appStoreUrl({ utmCampaign, utmContent })}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        track("app_store_click", {
          campaign: utmCampaign ?? "unknown",
          content: utmContent ?? "",
        });
      }}
      className={`${base} ${size} bg-orange text-cream hover:opacity-90`}
    >
      {compact ? "Open in App Store" : "Get Sundee Fundee on the App Store"}
    </a>
  );
}
