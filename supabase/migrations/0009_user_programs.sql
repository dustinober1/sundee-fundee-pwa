-- Sundee Fundee — Feature 2: user-owned program templates.
--
-- Additive: a nullable owner_user_id column.
--   owner_user_id IS NULL  → global/admin template (original behavior).
--   owner_user_id = uid()  → user-created template.
--
-- RLS:
--   SELECT — keep everyone able to read global templates; restrict user-owned
--            rows to their owner or an admin.
--   INSERT/UPDATE/DELETE — admins can touch any row; users can only touch
--            rows they own.

alter table public.program_templates
  add column if not exists owner_user_id uuid references auth.users(id) on delete cascade;

create index if not exists program_templates_owner_idx
  on public.program_templates (owner_user_id);

-- ─── SELECT policy: scope visibility ──────────────────────────────────────
drop policy if exists program_templates_select_all on public.program_templates;

drop policy if exists program_templates_select_visible on public.program_templates;
create policy program_templates_select_visible on public.program_templates
  for select
  using (
    owner_user_id is null
    or owner_user_id = auth.uid()
    or exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ─── WRITE policy: admins OR row owner ────────────────────────────────────
drop policy if exists program_templates_admin_write on public.program_templates;

drop policy if exists program_templates_owner_or_admin_write on public.program_templates;
create policy program_templates_owner_or_admin_write on public.program_templates
  for all
  using (
    (owner_user_id is not null and owner_user_id = auth.uid())
    or exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  )
  with check (
    (owner_user_id is not null and owner_user_id = auth.uid())
    or exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );
