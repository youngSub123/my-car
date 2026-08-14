// 프론트엔드에서 호출: 저장된 기아 커넥트 토큰으로 주행 가능 거리를 조회한다.
// 만료된 access_token은 refresh_token으로 갱신 후 재시도한다.
import { corsHeaders, getDte, refreshAccessToken } from '../_shared/kia.ts'
import { getSupabaseAdmin } from '../_shared/supabaseAdmin.ts'

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders(origin) })
  }

  const admin = getSupabaseAdmin()
  const { data: conn } = await admin
    .from('kia_connections')
    .select('id, access_token, refresh_token, expires_at, kia_car_id')
    .limit(1)
    .maybeSingle()

  if (!conn || !conn.access_token || !conn.kia_car_id) {
    return new Response(JSON.stringify({ connected: false }), {
      status: 200,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    })
  }

  try {
    let accessToken = conn.access_token
    const isExpired = conn.expires_at && new Date(conn.expires_at).getTime() < Date.now() + 60_000
    if (isExpired && conn.refresh_token) {
      const refreshed = await refreshAccessToken(conn.refresh_token)
      accessToken = refreshed.access_token
      const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
      await admin
        .from('kia_connections')
        .update({
          access_token: refreshed.access_token,
          refresh_token: refreshed.refresh_token ?? conn.refresh_token,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conn.id)
    }

    const dte = await getDte(accessToken, conn.kia_car_id)
    return new Response(
      JSON.stringify({
        connected: true,
        carId: conn.kia_car_id,
        distanceToEmpty: dte,
      }),
      { status: 200, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } },
    )
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ connected: true, error: String(e) }), {
      status: 200,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    })
  }
})
