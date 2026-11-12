alter table public.tulio_media
  add column if not exists source_type text not null default 'storage',
  add column if not exists external_provider text,
  add column if not exists external_id text,
  add column if not exists embed_url text;

alter table public.media
  add column if not exists source_type text not null default 'storage',
  add column if not exists external_provider text,
  add column if not exists external_id text,
  add column if not exists embed_url text;
