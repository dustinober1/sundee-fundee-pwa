import { handleDonationCheckout } from "@/lib/donations/checkout";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleDonationCheckout(request);
}
