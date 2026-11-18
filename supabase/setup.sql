-- Run once on the designated, empty NewsStand project.
begin;

create table public.articles (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  category text not null check (category in (
    'local', 'politics', 'economy', 'sport', 'culture',
    'entertainment', 'variety', 'travel'
  )),
  title text not null,
  summary text not null,
  body text not null,
  image text not null,
  author text not null default '',
  published_at timestamptz,
  featured boolean not null default false,
  source_url text,
  source_name text,
  source_published_at timestamptz,
  image_credit text,
  seo_title text,
  seo_description text,
  additional_images jsonb not null default '[]'::jsonb check (jsonb_typeof(additional_images) = 'array')
);

create index articles_latest on public.articles (published_at desc);
create index articles_section_latest on public.articles (category, published_at desc);

alter table public.articles enable row level security;
revoke all on public.articles from anon, authenticated;
grant select on public.articles to anon, authenticated;

create policy read_published on public.articles
  for select to anon, authenticated
  using (published_at <= now());

-- Supabase may install this event trigger in new projects. API clients do not need it.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;

commit;
