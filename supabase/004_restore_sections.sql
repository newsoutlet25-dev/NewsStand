begin;
alter table public.articles drop constraint articles_category_check;
alter table public.articles add constraint articles_category_check
  check (category in ('local','politics','economy','sport','culture','entertainment','variety','travel'));
commit;
