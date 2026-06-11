# Supabase Free-Tier Demo Persistence

Pipeline Pulse works without Supabase by using the local demo backend adapter in `src/lib/demo-backend`.
Use Supabase when you want shared persistence across browsers or a stronger backend story in the demo.

## Free-Tier Setup

1. Create a free Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy the project URL and publishable/anon key.
5. Add these to `.env`:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

For the portfolio demo, `schema.sql` is enough.
For a stricter security story, review `supabase/hardened-policies.sql` after you have real Supabase Auth users and role claims in place.

## What Gets Persisted

- DQ validation runs and evidence packs
- Governance policies and lifecycle changes
- Contract compatibility checks
- Metadata harvest run evidence
- RBAC/ABAC access decisions
- Incident action items
- AI model review gates
- Executive board decisions
- Value realization snapshots

The current schema is intentionally demo-friendly and uses permissive RLS policies for synthetic data.
Do not use these policies with real customer, employee, financial, health, or regulated data.
