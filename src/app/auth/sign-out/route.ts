import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
} from "@/lib/pwa/supabase-server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  if (isSupabaseServerConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL("/app", requestUrl.origin));
}
