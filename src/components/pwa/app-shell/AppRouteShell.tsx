import type { ReactNode } from "react";

export function AppRouteShell({ children }: { children: ReactNode }) {
  return (
    <main id="app" className="flex-1" tabIndex={-1}>
      {children}
    </main>
  );
}
