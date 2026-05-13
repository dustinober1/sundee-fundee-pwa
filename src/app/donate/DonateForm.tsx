"use client";

import { useState } from "react";

const ONE_TIME_AMOUNTS = [3, 5, 10, 25];
const MONTHLY_AMOUNTS = [3, 5, 10];

export function DonateForm() {
  const [mode, setMode] = useState<"payment" | "subscription">("payment");
  const [selected, setSelected] = useState<number>(5);
  const [custom, setCustom] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amounts = mode === "payment" ? ONE_TIME_AMOUNTS : MONTHLY_AMOUNTS;
  const amount = custom ? parseFloat(custom) : selected;

  async function handleDonate() {
    setError(null);
    if (!amount || isNaN(amount) || amount < 1) {
      setError("Please enter an amount of at least $1.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, mode }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleModeChange(newMode: "payment" | "subscription") {
    setMode(newMode);
    setCustom("");
    setSelected(5);
  }

  return (
    <div className="mt-10 rounded-2xl border border-border bg-cream p-6 shadow-sm">
      <div className="flex rounded-lg border border-border p-1">
        <button
          onClick={() => handleModeChange("payment")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            mode === "payment" ? "bg-navy text-cream" : "text-muted hover:text-navy"
          }`}
        >
          One-time
        </button>
        <button
          onClick={() => handleModeChange("subscription")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            mode === "subscription"
              ? "bg-navy text-cream"
              : "text-muted hover:text-navy"
          }`}
        >
          Monthly
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {amounts.map((a) => (
          <button
            key={a}
            onClick={() => {
              setSelected(a);
              setCustom("");
            }}
            className={`rounded-lg border py-3 text-sm font-semibold transition-colors ${
              selected === a && !custom
                ? "border-orange bg-orange/10 text-orange"
                : "border-border text-navy hover:border-orange hover:text-orange"
            }`}
          >
            ${a}
            {mode === "subscription" ? "/mo" : ""}
          </button>
        ))}
      </div>

      <div className="relative mt-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
          $
        </span>
        <input
          type="number"
          min="1"
          max="999"
          placeholder="Custom amount"
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value);
            setSelected(0);
          }}
          className="w-full rounded-lg border border-border py-3 pl-7 pr-4 text-sm text-navy placeholder:text-muted focus:border-orange focus:outline-none"
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        onClick={handleDonate}
        disabled={loading}
        className="mt-5 w-full rounded-lg bg-orange py-3.5 text-sm font-semibold text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading
          ? "Redirecting..."
          : `Donate${amount && !isNaN(amount) ? ` $${amount}${mode === "subscription" ? "/mo" : ""}` : ""}`}
      </button>

      <p className="mt-4 text-center text-xs text-muted">
        Processed securely by Stripe. You&apos;ll receive a receipt by email.
      </p>
    </div>
  );
}
