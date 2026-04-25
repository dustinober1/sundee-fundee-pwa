import Stripe from "stripe";

export const runtime = "nodejs";

function getSiteUrl(request: Request) {
  const configuredSiteUrl =
    process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/$/, "");
  }

  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    return `${forwardedProto ?? url.protocol.replace(":", "")}://${forwardedHost}`;
  }

  return url.origin;
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return Response.json(
      { error: "Stripe is not configured for this environment." },
      { status: 500 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { amount, mode } = payload as {
    amount?: number;
    mode?: "payment" | "subscription";
  };

  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount < 1 ||
    amount > 999
  ) {
    return Response.json({ error: "Invalid amount" }, { status: 400 });
  }

  if (mode !== "payment" && mode !== "subscription") {
    return Response.json({ error: "Invalid checkout mode" }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const unitAmount = Math.round(amount * 100);
  const siteUrl = getSiteUrl(request);

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name:
                mode === "subscription"
                  ? "Support Sundee Fundee (Monthly)"
                  : "Support Sundee Fundee",
              description:
                "Keeps the app free and ad-free for everyone. Thank you.",
            },
            unit_amount: unitAmount,
            ...(mode === "subscription" && {
              recurring: { interval: "month" },
            }),
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/donate/success`,
      cancel_url: `${siteUrl}/donate`,
    });

    if (!session.url) {
      return Response.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return Response.json({ url: session.url });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode ?? 502 },
      );
    }

    console.error("Stripe checkout failed", error);

    return Response.json(
      { error: "Unable to start Stripe checkout." },
      { status: 500 },
    );
  }
}
