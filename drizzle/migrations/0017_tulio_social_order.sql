-- Order of the section 1 / footer icons (first = leftmost). Null keeps the default order.
alter table public.tulio_home
  add column if not exists social_order text[];
