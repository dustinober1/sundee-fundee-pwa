"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  createSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/pwa/supabase-browser";

export function AuthMagicLinkForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseBrowserConfigured();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!configured) {
      setError("Cloud sync is not configured in this environment.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setMessage("Check your email for the sign-in link.");
    } catch {
      setError("Unable to start cloud sync sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-cream px-5 py-8 text-navy">
      <div className="mx-auto flex min-h-[78dvh] max-w-md flex-col justify-center">
        <Link href="/app" className="mb-8 text-sm font-semibold text-orange">
          Back to app
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange">
          Optional cloud sync
        </p>
        <h1 className="font-display mt-4 text-5xl font-bold leading-tight">
          Send a private sign-in link.
        </h1>
        <p className="mt-5 text-sm leading-6 text-muted">
          Cloud sync is optional. Local-only mode works without this step.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-navy" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-lg border border-border bg-surface px-4 text-base text-navy outline-none ring-orange/25 transition focus:border-orange focus:ring-4"
          />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {message ? <p className="text-sm text-recovery-good">{message}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-lg bg-navy px-5 text-sm font-semibold text-cream disabled:opacity-60"
          >
            {loading ? "Sending link" : "Send sign-in link"}
          </button>
        </form>
      </div>
    </main>
  );
}
