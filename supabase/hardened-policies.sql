-- Hardened starter policies for the portfolio demo after Supabase Auth is enabled.
-- Assumes JWT claims include:
--   app_role in ('platform_admin', 'data_steward', 'data_engineer', 'business_analyst', 'auditor')
--   tenant_scope as a text array claim for tenant-aware access

create or replace function public.current_app_role()
returns text
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'app_role', 'anonymous')
$$;

create or replace function public.current_tenant_scope()
returns jsonb
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'tenant_scope', '[]'::jsonb)
$$;

-- Example read posture
create policy "secure read dq runs"
on dq_runs
for select
using (
  public.current_app_role() in ('platform_admin', 'data_steward', 'data_engineer', 'auditor')
);

create policy "secure write dq runs"
on dq_runs
for insert
with check (
  public.current_app_role() in ('platform_admin', 'data_steward', 'data_engineer')
);

create policy "secure read governance policies"
on governance_policies
for select
using (
  public.current_app_role() in ('platform_admin', 'data_steward', 'auditor')
);

create policy "secure write governance policies"
on governance_policies
for insert
with check (
  public.current_app_role() in ('platform_admin', 'data_steward')
);

create policy "secure update governance policies"
on governance_policies
for update
using (
  public.current_app_role() in ('platform_admin', 'data_steward')
);

create policy "secure read contract checks"
on contract_checks
for select
using (
  public.current_app_role() in ('platform_admin', 'data_engineer', 'data_steward', 'auditor')
);

create policy "secure write contract checks"
on contract_checks
for insert
with check (
  public.current_app_role() in ('platform_admin', 'data_engineer')
);

create policy "secure read metadata harvest runs"
on metadata_harvest_runs
for select
using (
  public.current_app_role() in ('platform_admin', 'data_engineer', 'data_steward', 'auditor')
);

create policy "secure write metadata harvest runs"
on metadata_harvest_runs
for insert
with check (
  public.current_app_role() in ('platform_admin', 'data_engineer')
);

create policy "secure read access decisions"
on access_decisions
for select
using (
  public.current_app_role() in ('platform_admin', 'auditor', 'data_steward')
);

create policy "secure write access decisions"
on access_decisions
for insert
with check (
  public.current_app_role() in ('platform_admin', 'data_steward', 'data_engineer')
);

create policy "secure read incident action items"
on incident_action_items
for select
using (
  public.current_app_role() in ('platform_admin', 'data_engineer', 'auditor')
);

create policy "secure write incident action items"
on incident_action_items
for insert
with check (
  public.current_app_role() in ('platform_admin', 'data_engineer')
);

create policy "secure update incident action items"
on incident_action_items
for update
using (
  public.current_app_role() in ('platform_admin', 'data_engineer')
);

create policy "secure read ai reviews"
on ai_model_reviews
for select
using (
  public.current_app_role() in ('platform_admin', 'data_engineer', 'data_steward', 'auditor')
);

create policy "secure write ai reviews"
on ai_model_reviews
for insert
with check (
  public.current_app_role() in ('platform_admin', 'data_engineer', 'data_steward')
);

create policy "secure read board decisions"
on executive_board_decisions
for select
using (
  public.current_app_role() in ('platform_admin', 'auditor', 'business_analyst')
);

create policy "secure write board decisions"
on executive_board_decisions
for insert
with check (
  public.current_app_role() in ('platform_admin', 'business_analyst')
);

create policy "secure read value snapshots"
on value_snapshots
for select
using (
  public.current_app_role() in ('platform_admin', 'business_analyst', 'auditor')
);

create policy "secure write value snapshots"
on value_snapshots
for insert
with check (
  public.current_app_role() in ('platform_admin', 'business_analyst')
);
