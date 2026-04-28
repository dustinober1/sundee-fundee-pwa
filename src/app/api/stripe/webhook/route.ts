import Stripe from "stripe";
import { persistStripeDonationEvent } from "@/lib/donations/webhook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return Response.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const rawBody = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
    const persistence = await persistStripeDonationEvent(event);

    return Response.json({
      received: true,
      id: event.id,
      type: event.type,
      persistence,
    });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ error: "Invalid Stripe webhook." }, { status: 400 });
  }
}
