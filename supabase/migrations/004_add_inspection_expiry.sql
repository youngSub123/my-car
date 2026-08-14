-- 자동차 정기검사 만료일 컬럼 추가
alter table vehicles
  add column if not exists inspection_expiry date;
