-- 기아 커넥트 연동 정보 저장 (Edge Function에서 service role로만 접근)
create table if not exists kia_connections (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  kia_user_id text,
  kia_car_id text,
  oauth_state text,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS는 켜두고 정책은 만들지 않음 -> anon/authenticated 키로는 전혀 접근 불가,
-- service role(Edge Function)만 RLS를 우회해 접근 가능. 토큰이 담기므로 절대 공개 정책 추가하지 말 것.
alter table kia_connections enable row level security;
