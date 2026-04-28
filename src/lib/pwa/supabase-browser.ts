import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export function isSupabaseBrowserConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase is not configured for this environment.");
  }

  return createBrowserClient<Database>(url, anonKey);
}

export async function getCloudSession() {
  if (!isSupabaseBrowserConfigured()) return null;

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

export async function getCloudUser() {
  if (!isSupabaseBrowserConfigured()) return null;

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function isCloudConnected() {
  return Boolean(await getCloudUser());
}
