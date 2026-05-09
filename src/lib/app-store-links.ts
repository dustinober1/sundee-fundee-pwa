import { APP_STORE_URL } from "./site";

type BuildAppStoreUrlOptions = {
  campaign?: string;
  content?: string;
};

const DEFAULT_MEDIA_TYPE_TOKEN = "8";
const MAX_CAMPAIGN_TOKEN_LENGTH = 30;

function normalizeCampaignToken(parts: Array<string | undefined>) {
  const raw = parts.filter(Boolean).join("_") || "web";
  const normalized = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return (normalized || "web").slice(0, MAX_CAMPAIGN_TOKEN_LENGTH);
}

export function buildAppStoreUrl({ campaign, content }: BuildAppStoreUrlOptions = {}) {
  const url = new URL(APP_STORE_URL);
  url.searchParams.set("utm_source", "sundeefundee.com");
  url.searchParams.set("utm_medium", "web");
  url.searchParams.set("utm_term", "app_store");
  if (campaign) url.searchParams.set("utm_campaign", campaign);
  if (content) url.searchParams.set("utm_content", content);

  const providerToken = process.env.NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN;
  if (providerToken) {
    url.searchParams.set("pt", providerToken);
    url.searchParams.set("ct", normalizeCampaignToken([campaign, content]));
    url.searchParams.set(
      "mt",
      process.env.NEXT_PUBLIC_APP_STORE_MEDIA_TYPE_TOKEN ?? DEFAULT_MEDIA_TYPE_TOKEN,
    );
  }

  return url.toString();
}
