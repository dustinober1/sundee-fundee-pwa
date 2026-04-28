import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  ensureUserProfile,
  isSupabaseServerConfigured,
} from "@/lib/pwa/supabase-server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectUrl = new URL("/app", requestUrl.origin);

  if (!isSupabaseServerConfigured()) {
    redirectUrl.searchParams.set("sync", "not-configured");
    return NextResponse.redirect(redirectUrl);
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    const profileResult = error ? null : await ensureUserProfile();

    redirectUrl.searchParams.set(
      "sync",
      error || profileResult?.error ? "failed" : "connected",
    );
  }

  return NextResponse.redirect(redirectUrl);
}
