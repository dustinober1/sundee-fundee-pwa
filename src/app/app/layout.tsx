import type { Metadata } from "next";
import { AppRouteShell } from "@/components/pwa/app-shell/AppRouteShell";

export const metadata: Metadata = {
  title: "Training App",
  description: "Local-first Sundee Fundee PWA training app.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppRouteShell>{children}</AppRouteShell>;
}
