import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";

  const errorParam = url.searchParams.get("error_description") ?? url.searchParams.get("error");
  if (errorParam) {
    const login = new URL("/login", url.origin);
    login.searchParams.set("error", errorParam);
    return NextResponse.redirect(login);
  }

  if (!code) {
    const login = new URL("/login", url.origin);
    login.searchParams.set("error", "Missing auth code.");
    return NextResponse.redirect(login);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const login = new URL("/login", url.origin);
    login.searchParams.set("error", error.message);
    return NextResponse.redirect(login);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
