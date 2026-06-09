# Pipeline Pulse — Enterprise Data Pipeline Observability

[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start%20v1-1f6feb)](https://tanstack.com/start)
[![Cloudflare Workers](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-f38020)](https://workers.cloudflare.com)

> Production-grade control plane for data pipelines. Monitor jobs, trace lineage, detect anomalies, and ship architecture docs — all in one place.

**Live demo:** https://pipeline-pulse-79.lovable.app
**60-second walkthrough:** [`/demo`](https://pipeline-pulse-79.lovable.app/demo) · [`public/demo.mp4`](./public/demo.mp4)

![Enterprise Data Platform Overview](./public/og-image.jpg)

---

## ✨ Highlights

- **Real-time Overview** — KPIs, execution trend, system pulse, freshness scoreboard
- **Job Manager** — Lifecycle controls, log viewer, and an **AI Job Config Generator** (`"ETL from Salesforce to Snowflake nightly, retry 3x"` → filled form)
- **Pipeline Maps (Lineage)** — End-to-end DAG with **AI Impact Analysis** on every node (plain-English blast radius)
- **Architecture Viewer** — System diagrams with **one-click narrated PDF export**
- **Audit Trail** — Full event log with **AI Anomaly Detection** (off-hours access, foreign IPs, sensitive changes)
- **Metadata-Driven Data Quality Control Center** — Governed, auditable validation: incoming feed, metadata rule catalog, AI rule assistant, on-demand validation run, reconciliation, rejected/quarantine/golden datasets, analytics, audit evidence, incident workflow, and business impact view
- **Multi-tenant** — Tenants, contracted hours, billing rates, usage alerts
- **Incidents & Projects** — Severity tracking, ownership, cross-tenant pipeline projects
- **Live visitor counter** on the homepage

## 🛠 Tech Stack

- **Framework:** TanStack Start v1 (React 19, SSR-ready, Vite 7)
- **Styling:** Tailwind CSS v4 + shadcn/ui + semantic OKLCH tokens
- **Charts:** Recharts
- **Motion:** Framer Motion
- **Deploy:** Cloudflare Workers (via `@cloudflare/vite-plugin`)
- **Built with:** [Lovable](https://lovable.dev)

## 🚀 Quick Start

```bash
bun install
bun run dev          # http://localhost:5173
bun run build        # production build
```

> **Putting this in your own GitHub repo?** Follow the step-by-step guide in [GIT_SETUP.md](./GIT_SETUP.md).

## 🗺 Pages

| Route             | Purpose                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `/`               | Overview — KPIs, trends, system pulse                            |
| `/jobs`           | Job Manager + AI config generator                                |
| `/lineage`        | Pipeline Maps with AI impact analysis                            |
| `/architecture`   | System diagrams + narrated PDF export                            |
| `/audit`          | Audit log with AI anomaly detection                              |
| `/dq`             | Metadata-Driven Data Quality Control Center                      |
| `/incidents`      | Active incidents                                                 |
| `/projects`       | Cross-tenant pipeline projects                                   |
| `/tenants`        | Tenant management, contracts, billing rates                      |
| `/billing`        | Usage & alerts                                                   |
| `/settings`       | Org preferences & integrations                                   |

## 🛡 Data Quality Control Center (`/dq`)

A governed, metadata-driven validation workspace that turns ad-hoc checks
into an auditable enterprise capability.

- **Initial state:** only the **Incoming Feed**, **Metadata Rules**, and a
  **Run Data Quality Validation** button are visible — no premature results.
- **On run:** results, reconciliation, rejected/quarantine/golden datasets,
  analytics, audit evidence, incident workflow, and business impact tabs are
  revealed with an animated 10-step validation progress (demo dataset:
  93 passed, 6 rejected, 1 quarantined).
- **AI Rule Assistant:** suggests new metadata rules from the observed
  feed schema.
- **Positions the platform** for data governance, DataOps maturity, and
  converting fragmented manual validation into a scalable, auditable
  capability with clear business impact.

## 🔒 Security & Best Practices

- Strict CSP-friendly stack — no inline secrets, no API keys in client code
- Semantic design tokens only (no hard-coded colors)
- SEO: meta tags, OG image, sitemap, robots.txt, `llms.txt`
- Accessibility-first shadcn primitives (Radix under the hood)

## 📺 Demo Video

A 15-second motion reel lives at [`/public/demo.mp4`](./public/demo.mp4).

## 📄 License

Demo project — MIT-style, free to fork and remix.

---

Built with ❤️ on [Lovable](https://lovable.dev) for the **May 23–25, 2026 weekend builder contest**.
