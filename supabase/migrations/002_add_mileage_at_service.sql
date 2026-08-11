-- 정비 당시 주행거리 컬럼 추가
alter table maintenance_records
  add column if not exists mileage_at_service integer;
