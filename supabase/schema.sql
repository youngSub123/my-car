-- My Car: 초기 스키마
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.

create extension if not exists "pgcrypto";

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  car_model text not null,
  current_mileage integer not null default 0,
  insurance_provider text,
  last_accident_date date,
  insurance_start date,
  insurance_end date,
  created_at timestamptz not null default now()
);

create table if not exists maintenance_records (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  category text not null,
  service_date date not null,
  cost numeric not null default 0,
  mileage_at_service integer,
  next_due_mileage integer,
  memo text,
  created_at timestamptz not null default now()
);

create index if not exists maintenance_records_vehicle_id_idx
  on maintenance_records (vehicle_id);

-- 1인 포트폴리오 앱 기준: RLS는 켜두되 anon key로 전체 허용.
-- 나중에 로그인을 붙이면 auth.uid() 기반 정책으로 교체하세요.
alter table vehicles enable row level security;
alter table maintenance_records enable row level security;

create policy "vehicles: anon full access" on vehicles
  for all using (true) with check (true);

create policy "maintenance_records: anon full access" on maintenance_records
  for all using (true) with check (true);

-- 초기 차량 1대 생성 (없을 때만)
insert into vehicles (car_model, current_mileage, insurance_provider, last_accident_date, insurance_start, insurance_end)
select '2016년식 쏘렌토', 82000, '삼성화재 다이렉트', '2025-05-01', '2026-01-15', '2027-01-14'
where not exists (select 1 from vehicles);
