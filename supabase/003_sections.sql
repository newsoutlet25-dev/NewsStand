begin;
alter table public.articles drop constraint articles_category_check;
update public.articles set category = case category
  when 'world' then 'politics'
  when 'travel' then 'local'
  else 'culture'
end where category in ('world','travel','variety','entertainment','opinion');
alter table public.articles add constraint articles_category_check
  check (category in ('local','politics','economy','sport','culture'));
commit;
