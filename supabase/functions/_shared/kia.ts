// 기아 커넥트(KIA Developers) API 연동 공통 헬퍼
// 규격서 기준: 계정 API는 prd.kr-ccapi.kia.com, 데이터 API는 dev.kr-ccapi.kia.com 도메인을 사용한다.
export const KIA_ACCOUNT_BASE = 'https://prd.kr-ccapi.kia.com'
export const KIA_DATA_BASE = 'https://dev.kr-ccapi.kia.com'

export const KIA_CLIENT_ID = Deno.env.get('KIA_CLIENT_ID') ?? ''
export const KIA_CLIENT_SECRET = Deno.env.get('KIA_CLIENT_SECRET') ?? ''
export const KIA_REDIRECT_URI = Deno.env.get('KIA_REDIRECT_URI') ?? ''
export const FRONTEND_URL = Deno.env.get('FRONTEND_URL') ?? ''

function basicAuthHeader() {
  return 'Basic ' + btoa(`${KIA_CLIENT_ID}:${KIA_CLIENT_SECRET}`)
}

export interface KiaTokenResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
}

export async function exchangeCodeForToken(code: string): Promise<KiaTokenResponse> {
  const res = await fetch(`${KIA_ACCOUNT_BASE}/api/v1/user/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: KIA_REDIRECT_URI,
    }),
  })
  if (!res.ok) {
    throw new Error(`token exchange failed: ${res.status} ${await res.text()}`)
  }
  return res.json()
}

export async function refreshAccessToken(refreshToken: string): Promise<KiaTokenResponse> {
  const res = await fetch(`${KIA_ACCOUNT_BASE}/api/v1/user/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  if (!res.ok) {
    throw new Error(`token refresh failed: ${res.status} ${await res.text()}`)
  }
  return res.json()
}

export interface KiaCar {
  carId: string
  carNickname?: string
  carType?: string
  carName?: string
  carSellname?: string
}

export async function getCarList(accessToken: string): Promise<KiaCar[]> {
  const res = await fetch(`${KIA_DATA_BASE}/api/v1/car/profile/carlist`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    throw new Error(`carlist failed: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  return data.cars ?? []
}

export interface KiaDte {
  timestamp: string
  value: number
  unit: number
}

export async function getDte(accessToken: string, carId: string): Promise<KiaDte> {
  const res = await fetch(`${KIA_DATA_BASE}/api/v1/car/status/${carId}/dte`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    throw new Error(`dte failed: ${res.status} ${await res.text()}`)
  }
  return res.json()
}

export function corsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  }
}
