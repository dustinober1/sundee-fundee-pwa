import Stripe from "stripe";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sundeefundee.com";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const { amount, mode } = (await request.json()) as {
    amount: number;
    mode: "payment" | "subscription";
  };

  if (!amount || amount < 1 || amount > 999) {
    return Response.json({ error: "Invalid amount" }, { status: 400 });
  }

  const unitAmount = Math.round(amount * 100);

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
            description: "Keeps the app free and ad-free for everyone. Thank you.",
          },
          unit_amount: unitAmount,
          ...(mode === "subscription" && {
            recurring: { interval: "month" },
          }),
        },
        quantity: 1,
      },
    ],
    success_url: `${SITE_URL}/donate/success`,
    cancel_url: `${SITE_URL}/donate`,
  });

  return Response.json({ url: session.url });
}
