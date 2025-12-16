-- supabase/migrations/0003_admin_security.sql

-- Helper function to check for a custom 'admin' claim on the authenticated user.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
    false
  );
$$;
