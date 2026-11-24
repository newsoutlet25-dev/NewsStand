alter table public.articles
  add column deleted_at timestamptz,
  add column tags text[] not null default '{}',
  add column secondary_categories text[] not null default '{}',
  add column lead_image_details jsonb not null default '{}'::jsonb;

alter policy read_published on public.articles
  using (deleted_at is null and published_at <= now());

-- A computed PostgREST field lets the client bind a single search pattern.
create function public.editorial_search(public.articles) returns text
language sql immutable strict security invoker set search_path='' as $$
  select concat_ws(' ', $1.slug,$1.title,$1.summary,$1.body,array_to_string($1.tags,' '));
$$;

create function newsrss_private.track_editorial_slug() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  update newsrss_private.receipts set article_slug=new.slug where news_id=new.newsrss_id;
  return new;
end $$;
revoke all on function newsrss_private.track_editorial_slug() from public,anon,authenticated;
create trigger track_editorial_slug after update of slug on public.articles
  for each row when (new.newsrss_id is not null and new.slug<>old.slug)
  execute function newsrss_private.track_editorial_slug();
