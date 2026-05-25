import type { NextConfig } from "next";

const staticAssetCacheHeader = {
  key: "Cache-Control",
  value: "public, max-age=86400, stale-while-revalidate=604800",
};

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/app-screenshots/:path*",
        headers: [staticAssetCacheHeader],
      },
      {
        source: "/lifestyle-videos/:path*",
        headers: [staticAssetCacheHeader],
      },
      {
        source: "/workout-plans/(.*\\.pdf)",
        headers: [staticAssetCacheHeader],
      },
      {
        source: "/workout-plans/(.*\\.png)",
        headers: [staticAssetCacheHeader],
      },
      {
        source: "/Logo.jpeg",
        headers: [staticAssetCacheHeader],
      },
      {
        source: "/og-image.svg",
        headers: [staticAssetCacheHeader],
      },
    ];
  },
};

export default nextConfig;
