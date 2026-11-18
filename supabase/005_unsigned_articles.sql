begin;
alter table public.articles alter column author set default '';
update public.articles set author = '' where author = 'فريق التحرير';
commit;
