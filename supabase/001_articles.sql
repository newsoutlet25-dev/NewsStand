begin;
create table public.articles (
 slug text primary key check (slug ~ '^[a-z0-9-]+$'),
 category text not null check (category in ('local','economy','world','sport','culture','travel')),
 title text not null, summary text not null, body text not null, image text not null,
 author text not null default 'فريق التحرير',
 published_at timestamptz, featured boolean not null default false
);
create index articles_latest on public.articles(published_at desc);
alter table public.articles enable row level security;
revoke all on public.articles from anon, authenticated;
grant select on public.articles to anon, authenticated;
create policy read_published on public.articles for select to anon, authenticated
 using (published_at <= now());
commit;
