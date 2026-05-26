# Security Policy

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security problems.

Instead, open a [private security advisory](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
on this repository. We aim to respond within 5 business days.

## Supported versions

Only the `main` branch receives security updates. This is a demo project — for
production use, fork and pin to a commit you have audited.

## Scope

In scope:

- The web application in `src/`
- The Cloudflare Worker entry in `src/server.ts`
- Build configuration (`vite.config.ts`, `wrangler.jsonc`)

Out of scope: third-party dependencies (report upstream), the Remotion video
renderer in `remotion/` (offline tool), and the Lovable platform itself
(report to [Lovable](https://lovable.dev)).
