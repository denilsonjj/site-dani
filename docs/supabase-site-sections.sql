-- Execute este arquivo inteiro no SQL Editor do Supabase.
-- Ele cria o CMS por seção e o bucket público usado pelo painel administrativo.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  section_key text not null,
  eyebrow jsonb not null default '{}'::jsonb,
  title jsonb not null default '{}'::jsonb,
  description jsonb not null default '{}'::jsonb,
  body jsonb not null default '{}'::jsonb,
  image_url text,
  image_alt jsonb not null default '{}'::jsonb,
  primary_cta_label jsonb not null default '{}'::jsonb,
  primary_cta_href text,
  secondary_cta_label jsonb not null default '{}'::jsonb,
  secondary_cta_href text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_key, section_key)
);

create index if not exists site_sections_page_idx
on public.site_sections (page_key, is_published, sort_order);

alter table public.site_sections enable row level security;

drop policy if exists "Published site sections are readable" on public.site_sections;
create policy "Published site sections are readable"
on public.site_sections for select
using (is_published = true);

drop trigger if exists set_site_sections_updated_at on public.site_sections;
create trigger set_site_sections_updated_at
before update on public.site_sections
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  15728640,
  array['image/avif', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public site media is readable" on storage.objects;
create policy "Public site media is readable"
on storage.objects for select
using (bucket_id = 'site-media');

-- Escrita e exclusão ficam restritas à service role usada pelas APIs protegidas
-- do painel. Não crie políticas públicas de INSERT, UPDATE ou DELETE neste bucket.
