-- Sundee Fundee — initial schema.
-- Apply with: supabase db push   (or supabase migration up)

create extension if not exists "pgcrypto";

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── enums ────────────────────────────────────────────────────────────────
do $$ begin
  create type public.weight_unit as enum ('lb', 'kg');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.experience_level as enum ('beginner', 'intermediate', 'advanced');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.primary_goal as enum ('strength', 'hypertrophy', 'endurance', 'general_fitness');
exception when duplicate_object then null; end $$;

-- ─── user_profiles ────────────────────────────────────────────────────────
create table if not exists public.user_profiles (
  id                       uuid primary key references auth.users(id) on delete cascade,
  display_name             text,
  given_name               text,
  family_name              text,
  weight_unit              public.weight_unit       not null default 'lb',
  experience_level         public.experience_level,
  primary_goal             public.primary_goal,
  cycle_tracking_enabled   boolean                  not null default false,
  onboarded_at             timestamptz,
  created_at               timestamptz              not null default now(),
  updated_at               timestamptz              not null default now()
);

drop trigger if exists user_profiles_updated_at on public.user_profiles;
create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;

drop policy if exists user_profiles_select_own on public.user_profiles;
create policy user_profiles_select_own
  on public.user_profiles for select
  using (auth.uid() = id);

drop policy if exists user_profiles_insert_own on public.user_profiles;
create policy user_profiles_insert_own
  on public.user_profiles for insert
  with check (auth.uid() = id);

drop policy if exists user_profiles_update_own on public.user_profiles;
create policy user_profiles_update_own
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── auth.users → user_profiles trigger ───────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, display_name, given_name, family_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'given_name',
    new.raw_user_meta_data->>'family_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
