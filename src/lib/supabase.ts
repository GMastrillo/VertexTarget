import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase-config";

export function isSupabaseConfigured() {
  return Boolean(getSupabaseConfig());
}

export function createSupabaseBrowserClient() {
  const config = getSupabaseConfig();
  if (!config) return null;
  return createBrowserClient(config.url, config.key);
}
