begin;
create table public.article_views (
  article_slug text not null references public.articles(slug) on update cascade on delete cascade
);
create index article_views_slug_idx on public.article_views(article_slug);
alter table public.article_views enable row level security;
revoke all on public.article_views from public, anon, authenticated;
grant select(article_slug), insert(article_slug) on public.article_views to anon, authenticated;
create policy visible_view_counts on public.article_views for select to anon, authenticated
using (exists (select 1 from public.articles a where a.slug = article_slug));
create policy record_published_views on public.article_views for insert to anon, authenticated
with check (exists (select 1 from public.articles a where a.slug = article_slug));
commit;
