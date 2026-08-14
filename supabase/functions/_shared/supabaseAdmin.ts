import { createClient } from 'jsr:@supabase/supabase-js@2'

// Edge Function 런타임에는 SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY가 자동으로 주입된다.
export function getSupabaseAdmin() {
  const url = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  return createClient(url, serviceRoleKey)
}
