import { describe, expect, it } from "vitest";
import type Stripe from "stripe";
import { donationFromCheckoutSession } from "./webhook";

describe("donation webhook helpers", () => {
  it("extracts donation records from completed checkout sessions", () => {
    const donation = donationFromCheckoutSession({
      id: "cs_test_123",
      object: "checkout.session",
      amount_total: 500,
      currency: "usd",
      mode: "payment",
      payment_status: "paid",
      customer_details: {
        email: "supporter@example.com",
      },
      customer_email: null,
      metadata: {
        purpose: "donation",
      },
      payment_intent: "pi_test_123",
    } as unknown as Stripe.Checkout.Session);

    expect(donation).toEqual({
      id: "cs_test_123",
      email: "supporter@example.com",
      stripeCheckoutSessionId: "cs_test_123",
      stripePaymentIntentId: "pi_test_123",
      amountCents: 500,
      currency: "usd",
      mode: "payment",
      status: "paid",
    });
  });

  it("ignores non-donation checkout sessions", () => {
    const donation = donationFromCheckoutSession({
      id: "cs_test_456",
      object: "checkout.session",
      amount_total: 500,
      currency: "usd",
      mode: "payment",
      metadata: {
        purpose: "other",
      },
    } as unknown as Stripe.Checkout.Session);

    expect(donation).toBeNull();
  });
});
