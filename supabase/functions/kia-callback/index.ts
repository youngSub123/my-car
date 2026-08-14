// 프론트엔드(/kia/callback)에서 fetch로 호출하는 JSON API.
// Edge Function은 HTML을 직접 렌더링할 수 없어서(플랫폼이 Content-Type을 강제로 text/plain으로
// 바꿔버림), 브라우저 리다이렉트/폼 자동제출은 프론트엔드가 담당하고
// 이 함수는 client_secret이 필요한 서버 사이드 작업만 처리한다.
//
// action=exchange  { code, state }        -> 토큰 교환 후 저장, access_token을 프론트에 반환
// action=complete  { userId, state }      -> 동의 완료 처리, 차량 목록 조회 + carId 저장
import { corsHeaders, exchangeCodeForToken, getCarList } from '../_shared/kia.ts'
import { getSupabaseAdmin } from '../_shared/supabaseAdmin.ts'

async function upsertConnection(admin: ReturnType<typeof getSupabaseAdmin>, patch: Record<string, unknown>) {
  const { data: existing } = await admin.from('kia_connections').select('id').limit(1).maybeSingle()
  if (existing) {
    await admin.from('kia_connections').update(patch).eq('id', existing.id)
    return existing.id as string
  }
  const { data: vehicle } = await admin.from('vehicles').select('id').limit(1).maybeSingle()
  const { data: inserted, error } = await admin
    .from('kia_connections')
    .insert({ ...patch, vehicle_id: vehicle?.id ?? null })
    .select('id')
    .single()
  if (error) throw error
  return inserted.id as string
}

function json(body: unknown, origin: string | null, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders(origin) })
  }

  const admin = getSupabaseAdmin()

  try {
    const body = await req.json()
    const { action } = body

    if (action === 'exchange') {
      const { code, state } = body
      const token = await exchangeCodeForToken(code)
      const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString()
      await upsertConnection(admin, {
        access_token: token.access_token,
        refresh_token: token.refresh_token ?? null,
        expires_at: expiresAt,
        oauth_state: state ?? null,
        updated_at: new Date().toISOString(),
      })
      return json({ accessToken: token.access_token }, origin)
    }

    if (action === 'complete') {
      const { userId, state } = body
      const { data: conn } = await admin
        .from('kia_connections')
        .select('id, access_token, oauth_state')
        .limit(1)
        .maybeSingle()

      if (!conn || !conn.access_token) {
        return json({ error: '연동 세션을 찾을 수 없습니다' }, origin, 400)
      }
      if (conn.oauth_state && state && conn.oauth_state !== state) {
        return json({ error: 'state 값이 일치하지 않습니다' }, origin, 400)
      }

      const cars = await getCarList(conn.access_token)
      const car = cars[0]
      await admin
        .from('kia_connections')
        .update({
          kia_user_id: userId ?? null,
          kia_car_id: car?.carId ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conn.id)

      return json({ ok: true, carId: car?.carId ?? null }, origin)
    }

    return json({ error: 'unknown action' }, origin, 400)
  } catch (e) {
    console.error(e)
    return json({ error: String(e) }, origin, 500)
  }
})
