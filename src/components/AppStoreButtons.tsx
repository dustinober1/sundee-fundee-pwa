"use client";

import { track } from "@vercel/analytics";
import { buildAppStoreUrl } from "../lib/app-store-links";

type Props = {
  compact?: boolean;
  utmCampaign?: string;
  utmContent?: string;
};

export function AppStoreButtons({
  compact = false,
  utmCampaign,
  utmContent,
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-8 text-center font-medium leading-tight transition";
  const size = compact ? "min-h-10 px-5 py-2 text-sm" : "min-h-12 py-3";

  return (
    <a
      href={buildAppStoreUrl({ campaign: utmCampaign, content: utmContent })}
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
