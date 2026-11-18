begin;
alter table public.articles drop constraint articles_category_check;
alter table public.articles add constraint articles_category_check
 check (category in ('local','economy','world','sport','culture','travel','entertainment','variety','opinion'));
create index articles_section_latest on public.articles(category,published_at desc);
commit;
