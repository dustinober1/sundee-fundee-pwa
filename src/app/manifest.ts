import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sundee Fundee",
    short_name: "Sundee",
    description:
      "Privacy-first recovery-aware strength training with local-only mode.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    background_color: "#f4f0df",
    theme_color: "#0d1a40",
    orientation: "portrait-primary",
    categories: ["health", "fitness", "productivity"],
    icons: [
      {
        src: "/Logo.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/Logo.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Open training app",
        short_name: "App",
        url: "/app",
        description: "Open the Sundee Fundee training app.",
      },
      {
        name: "Support Sundee Fundee",
        short_name: "Donate",
        url: "/donate",
        description: "Make a donation to keep the app free.",
      },
    ],
  };
}
