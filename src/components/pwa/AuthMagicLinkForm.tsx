"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  createSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/pwa/supabase-browser";

type AuthMode = "password" | "magic-link";
type AuthIntent = "sign-in" | "sign-up";

function authHeading(intent: AuthIntent, mode: AuthMode) {
  if (mode === "magic-link") {
    return intent === "sign-in" ? "Send a private sign-in link." : "Send a private sign-up link.";
  }

  return intent === "sign-in" ? "Sign in with email and password." : "Create an account with email and password.";
}

function authDescription(intent: AuthIntent, mode: AuthMode) {
  if (mode === "magic-link") {
    return intent === "sign-in"
      ? "Cloud sync is optional. We’ll email you a private sign-in link."
      : "Cloud sync is optional. We’ll email you a private sign-up link so you can confirm this device.";
  }

  return intent === "sign-in"
    ? "Cloud sync is optional. Sign in with your email and password if you want multi-device backup."
    : "Create an account for optional cloud sync. Local-only mode still works without this step.";
}

function submitLabel(intent: AuthIntent, mode: AuthMode, loading: boolean) {
  if (loading) {
    if (mode === "magic-link") return intent === "sign-in" ? "Sending link" : "Sending sign-up link";
    return intent === "sign-in" ? "Signing in" : "Creating account";
  }

  if (mode === "magic-link") return intent === "sign-in" ? "Send sign-in link" : "Send sign-up link";
  return intent === "sign-in" ? "Sign in" : "Create account";
}

export function AuthMagicLinkForm() {
  const [intent, setIntent] = useState<AuthIntent>("sign-in");
  const [mode, setMode] = useState<AuthMode>("magic-link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseBrowserConfigured();

  const heading = useMemo(() => authHeading(intent, mode), [intent, mode]);
  const description = useMemo(() => authDescription(intent, mode), [intent, mode]);

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

      if (mode === "magic-link") {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            shouldCreateUser: intent === "sign-up",
          },
        });

        if (otpError) {
          setError(otpError.message);
          return;
        }

        setMessage(
          intent === "sign-in"
            ? "Check your email for the sign-in link."
            : "Check your email for the sign-up confirmation link.",
        );
        return;
      }

      if (intent === "sign-in") {
        const { error: passwordError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (passwordError) {
          setError(passwordError.message);
          return;
        }

        window.location.href = "/app?sync=connected";
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setMessage("Account created. Check your email if confirmation is required before sign-in.");
    } catch {
      setError(
        mode === "magic-link"
          ? "Unable to start email-link authentication."
          : intent === "sign-in"
            ? "Unable to sign in with password."
            : "Unable to create your account.",
      );
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
        <h1 className="font-display mt-4 text-5xl font-bold leading-tight">{heading}</h1>
        <p className="mt-5 text-sm leading-6 text-muted">{description}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setIntent("sign-in")}
            className={`h-11 rounded-lg border px-4 text-sm font-semibold transition ${
              intent === "sign-in"
                ? "border-orange bg-orange text-cream"
                : "border-border bg-surface text-navy"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setIntent("sign-up")}
            className={`h-11 rounded-lg border px-4 text-sm font-semibold transition ${
              intent === "sign-up"
                ? "border-orange bg-orange text-cream"
                : "border-border bg-surface text-navy"
            }`}
          >
            Create account
          </button>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("magic-link")}
            className={`h-11 rounded-lg border px-4 text-sm font-semibold transition ${
              mode === "magic-link"
                ? "border-navy bg-navy text-cream"
                : "border-border bg-surface text-navy"
            }`}
          >
            Email link
          </button>
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`h-11 rounded-lg border px-4 text-sm font-semibold transition ${
              mode === "password"
                ? "border-navy bg-navy text-cream"
                : "border-border bg-surface text-navy"
            }`}
          >
            Email + password
          </button>
        </div>

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

          {mode === "password" ? (
            <>
              <label className="block text-sm font-semibold text-navy" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-lg border border-border bg-surface px-4 text-base text-navy outline-none ring-orange/25 transition focus:border-orange focus:ring-4"
              />
              <p className="text-xs leading-5 text-muted">
                Use at least 8 characters. If email confirmation is enabled in Supabase, new accounts must confirm before syncing.
              </p>
            </>
          ) : null}

          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {message ? <p className="text-sm text-recovery-good">{message}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-lg bg-navy px-5 text-sm font-semibold text-cream disabled:opacity-60"
          >
            {submitLabel(intent, mode, loading)}
          </button>
        </form>
      </div>
    </main>
  );
}
