begin;
create schema if not exists newsrss_private;
revoke all on schema newsrss_private from public, anon, authenticated;
grant usage on schema newsrss_private to anon;

create table newsrss_private.writer (
  singleton boolean primary key default true check (singleton),
  fingerprint text not null check (fingerprint ~ '^[a-f0-9]{64}$')
);
create table newsrss_private.receipts (
  news_id text primary key,
  article_slug text not null unique,
  received_at timestamptz not null default now(),
  original_item jsonb not null
);
revoke all on newsrss_private.writer, newsrss_private.receipts from public, anon, authenticated;
alter table newsrss_private.writer enable row level security;
alter table newsrss_private.receipts enable row level security;

alter table public.articles add column newsrss_id text unique,
  add column source_categories text[];

create function newsrss_private.store_batch(credential text, drafts jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  draft jsonb;
  item_id text;
  item_slug text;
begin
  if credential is null or length(credential) <> 64 or not exists (
    select 1 from newsrss_private.writer
    where fingerprint = encode(sha256(convert_to(credential,'UTF8')),'hex')
  ) then raise insufficient_privilege; end if;
  if jsonb_typeof(drafts) is distinct from 'array' then raise data_exception; end if;

  for draft in select value from jsonb_array_elements(drafts) loop
    item_id := draft->'original'->>'id';
    if nullif(btrim(item_id),'') is null or length(item_id)>200
       or nullif(btrim(draft->>'title'),'') is null
       or nullif(btrim(draft->>'body'),'') is null
       or coalesce(draft->>'source_url','') !~ '^https?://'
    then raise data_exception; end if;
    item_slug := 'rss-' || encode(sha256(convert_to(item_id,'UTF8')),'hex');
    insert into newsrss_private.receipts(news_id,article_slug,original_item)
    values(item_id,item_slug,draft->'original') on conflict(news_id) do nothing;
    if found then
      insert into public.articles(slug,newsrss_id,title,summary,body,image,category,source_categories,
        source_url,source_name,source_published_at,additional_images,author,published_at,featured)
      values(item_slug,item_id,draft->>'title',draft->>'summary',draft->>'body',draft->>'image',
        draft->>'category',array(select jsonb_array_elements_text(draft->'categories')),
        draft->>'source_url',draft->>'source_name',(draft->>'source_date')::timestamptz,coalesce(draft->'additional_images','[]'::jsonb),'',null,false);
    end if;
  end loop;
end $$;
revoke all on function newsrss_private.store_batch(text,jsonb) from public, authenticated, anon;
grant execute on function newsrss_private.store_batch(text,jsonb) to anon;

create function public.receive_newsrss_drafts(credential text, drafts jsonb)
returns void language sql security invoker set search_path = '' as $$
  select newsrss_private.store_batch(credential,drafts)
$$;
revoke all on function public.receive_newsrss_drafts(text,jsonb) from public, authenticated, anon;
grant execute on function public.receive_newsrss_drafts(text,jsonb) to anon;
commit;
