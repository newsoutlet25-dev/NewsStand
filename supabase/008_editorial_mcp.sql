alter table public.articles
  add column editorial_version integer not null default 1,
  add column editorial_created_at timestamptz not null default now(),
  add column seo_details jsonb not null default '{}'::jsonb
    check (jsonb_typeof(seo_details)='object');

create index articles_unpublished_created on public.articles(editorial_created_at desc, slug)
  where published_at is null;
