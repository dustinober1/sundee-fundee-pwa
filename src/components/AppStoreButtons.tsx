import { APP_STORE_URL, RUCKING_CLUB_URL } from "@/lib/site";

type Props = {
  compact?: boolean;
};

export function AppStoreButtons({ compact = false }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-8 font-medium transition";
  const size = compact ? "h-10 px-5 text-sm" : "h-12";

  return (
    <>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${size} bg-orange text-cream hover:opacity-90`}
      >
        {compact ? "Download" : "Download Sundee Fundee"}
      </a>
      <a
        href={RUCKING_CLUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${size} border border-orange bg-transparent text-orange hover:bg-orange/5`}
      >
        {compact ? "Rucking Club" : "Download Rucking Club"}
      </a>
    </>
  );
}
