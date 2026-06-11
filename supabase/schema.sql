-- Pipeline Pulse demo persistence schema for Supabase free tier.
-- The app currently uses the local demo backend adapter in src/lib/demo-backend.
-- Use this schema when you want shared persistence across browsers/users.

create table if not exists dq_runs (
  id text primary key,
  evidence_id text not null,
  input_file text not null,
  source_system text not null,
  rule_set text not null,
  rule_version text not null,
  total integer not null,
  passed integer not null,
  rejected integer not null,
  quarantined integer not null,
  pass_rate numeric not null,
  decision text not null check (decision in ('Continue Processing', 'Block Pipeline')),
  failures jsonb not null default '[]'::jsonb,
  audit jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists governance_policies (
  id text primary key,
  name text not null,
  domain text not null,
  owner text not null,
  steward text not null,
  status text not null check (status in ('Draft', 'Under Review', 'Approved', 'Active', 'Exception', 'Retired')),
  control text not null,
  evidence text not null,
  next_review date not null,
  exception_expiry date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contract_checks (
  id bigint generated always as identity primary key,
  contract_id text not null,
  gate text not null,
  compatible boolean not null,
  issues jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists metadata_harvest_runs (
  id text primary key,
  connector text not null,
  assets_scanned integer not null,
  fields_scanned integer not null,
  terms_linked integer not null,
  policies_applied integer not null,
  completeness_before numeric not null,
  completeness_after numeric not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists access_decisions (
  id bigint generated always as identity primary key,
  subject jsonb not null,
  resource jsonb not null,
  action text not null,
  allow boolean not null,
  reasons jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists incident_action_items (
  id text primary key,
  incident_id text not null,
  action text not null,
  owner text not null,
  due_date date not null,
  evidence text not null,
  status text not null default 'Open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ai_model_reviews (
  id bigint generated always as identity primary key,
  model_name text not null,
  gate text not null,
  evidence text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists executive_board_decisions (
  id bigint generated always as identity primary key,
  decision text not null,
  ask text not null,
  owner text not null,
  residual_risk text not null,
  impact text not null,
  status text not null default 'Decision Required',
  created_at timestamptz not null default now()
);

create table if not exists value_snapshots (
  id text primary key,
  evidence_id text not null,
  trust_score numeric not null,
  compliance_readiness numeric not null,
  realized_value_usd numeric not null,
  avoided_incident_cost_usd numeric not null,
  onboarding_savings_usd numeric not null,
  audit_savings_usd numeric not null,
  cost_optimization_usd numeric not null,
  narrative text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table dq_runs enable row level security;
alter table governance_policies enable row level security;
alter table contract_checks enable row level security;
alter table metadata_harvest_runs enable row level security;
alter table access_decisions enable row level security;
alter table incident_action_items enable row level security;
alter table ai_model_reviews enable row level security;
alter table executive_board_decisions enable row level security;
alter table value_snapshots enable row level security;

-- Demo-friendly policies. Tighten these before using non-synthetic data.
create policy "demo read dq runs" on dq_runs for select using (true);
create policy "demo write dq runs" on dq_runs for insert with check (true);
create policy "demo read policies" on governance_policies for select using (true);
create policy "demo write policies" on governance_policies for insert with check (true);
create policy "demo update policies" on governance_policies for update using (true);
create policy "demo read contract checks" on contract_checks for select using (true);
create policy "demo write contract checks" on contract_checks for insert with check (true);
create policy "demo read harvest runs" on metadata_harvest_runs for select using (true);
create policy "demo write harvest runs" on metadata_harvest_runs for insert with check (true);
create policy "demo read access decisions" on access_decisions for select using (true);
create policy "demo write access decisions" on access_decisions for insert with check (true);
create policy "demo read incident action items" on incident_action_items for select using (true);
create policy "demo write incident action items" on incident_action_items for insert with check (true);
create policy "demo update incident action items" on incident_action_items for update using (true);
create policy "demo read ai reviews" on ai_model_reviews for select using (true);
create policy "demo write ai reviews" on ai_model_reviews for insert with check (true);
create policy "demo read board decisions" on executive_board_decisions for select using (true);
create policy "demo write board decisions" on executive_board_decisions for insert with check (true);
create policy "demo read value snapshots" on value_snapshots for select using (true);
create policy "demo write value snapshots" on value_snapshots for insert with check (true);
