import Stripe from "stripe";
import {
  createSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from "../pwa/supabase-server";

export type DonationRecordInput = {
  id: string;
  email: string | null;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  amountCents: number;
  currency: string;
  mode: "payment" | "subscription";
  status: string;
};

export function donationFromCheckoutSession(
  session: Stripe.Checkout.Session,
): DonationRecordInput | null {
  if (session.metadata?.purpose !== "donation") return null;
  if (!session.amount_total || !session.currency) return null;

  return {
    id: session.id,
    email: session.customer_details?.email ?? session.customer_email ?? null,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string" ? session.payment_intent : null,
    amountCents: session.amount_total,
    currency: session.currency,
    mode: session.mode === "subscription" ? "subscription" : "payment",
    status: session.payment_status ?? session.status ?? "unknown",
  };
}

export async function persistStripeDonationEvent(event: Stripe.Event) {
  if (!isSupabaseAdminConfigured()) {
    return { persisted: false, reason: "supabase-not-configured" as const };
  }

  const supabase = createSupabaseAdminClient();
  const { data: existingEvent, error: existingError } = await supabase
    .from("stripe_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existingEvent) {
    return { persisted: true, duplicate: true };
  }

  if (event.type === "checkout.session.completed") {
    const donation = donationFromCheckoutSession(
      event.data.object as Stripe.Checkout.Session,
    );

    if (donation) {
      const { error: donationError } = await supabase.from("donations").upsert(
        {
          id: donation.id,
          email: donation.email,
          stripe_checkout_session_id: donation.stripeCheckoutSessionId,
          stripe_payment_intent_id: donation.stripePaymentIntentId,
          amount_cents: donation.amountCents,
          currency: donation.currency,
          mode: donation.mode,
          status: donation.status,
        },
        { onConflict: "id" },
      );

      if (donationError) throw donationError;
    }
  }

  const { error: eventError } = await supabase.from("stripe_events").insert({
    id: event.id,
    type: event.type,
  });

  if (eventError) throw eventError;

  return { persisted: true, duplicate: false };
}
