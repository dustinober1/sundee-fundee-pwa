"use client";

import { useState, useTransition } from "react";
import type { Provider } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Status =
  | { kind: "idle" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "apple", label: "Continue with Apple" },
  { id: "google", label: "Continue with Google" },
  { id: "facebook", label: "Continue with Facebook" },
];

export function LoginForm({ next }: { next?: string }) {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  const callback = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  function signInWith(provider: Provider) {
    startTransition(async () => {
      setStatus({ kind: "idle" });
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callback },
      });
      if (error) setStatus({ kind: "error", message: error.message });
    });
  }

  function sendMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      setStatus({ kind: "idle" });
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: callback },
      });
      if (error) setStatus({ kind: "error", message: error.message });
      else setStatus({ kind: "sent" });
    });
  }

  return (
    <div className="mt-8 space-y-3">
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="button"
          disabled={pending}
          onClick={() => signInWith(p.id)}
          className="flex w-full h-12 items-center justify-center rounded-lg border border-border bg-surface px-5 font-medium text-navy transition-colors hover:bg-cream disabled:opacity-50"
        >
          {p.label}
        </button>
      ))}

      <div className="flex items-center gap-3 py-2">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-widest text-muted">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={sendMagicLink} className="space-y-3">
        <label className="block text-sm font-medium text-navy" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="block w-full h-12 rounded-lg border border-border bg-surface px-5 text-navy placeholder:text-muted focus:border-navy focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || !email}
          className="flex w-full h-12 items-center justify-center rounded-lg bg-orange px-5 font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Sending…" : "Email me a magic link"}
        </button>
      </form>

      {status.kind === "sent" ? (
        <p className="rounded-lg border border-recovery-good/40 bg-recovery-good/10 p-3 text-sm text-recovery-good">
          Check your inbox for a sign-in link.
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p className="rounded-lg border border-recovery-risk/40 bg-recovery-risk/10 p-3 text-sm text-recovery-risk">
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
