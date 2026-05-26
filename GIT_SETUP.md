# Push this project to GitHub — end-to-end

A complete walkthrough for getting **Pipeline Pulse** from Lovable into your own
GitHub repository, with every supporting file you need to make the repo look
production-ready.

---

## 0. Prerequisites

- A [GitHub](https://github.com) account
- [Git](https://git-scm.com/downloads) installed locally (`git --version`)
- [Bun](https://bun.sh) installed (`bun --version`) — this project uses Bun, not npm
- (Optional) The [GitHub CLI](https://cli.github.com/) `gh` for one-command repo creation

---

## Option A — Use Lovable's built-in GitHub integration (recommended)

This is the fastest path and keeps two-way sync with Lovable.

1. In the Lovable editor, open the **+** menu (bottom-left of the chat input) → **GitHub** → **Connect project**.
2. Authorize the **Lovable GitHub App** and pick the account / organization that should own the repo.
3. Click **Create Repository**. Lovable creates the repo and pushes the current code.
4. Done — every change you make in Lovable now pushes automatically, and every push to GitHub syncs back into Lovable.

> Only **one** GitHub account can be connected to a Lovable account at a time.

---

## Option B — Push manually from your machine

Use this if you want full control, a different host (GitLab, Bitbucket, self-hosted Gitea), or you're not using Lovable's integration.

### 1. Download the code

In Lovable: **Code editor** (top-left toggle) → **Download codebase** at the bottom of the file tree.
Unzip it somewhere sensible:

```bash
unzip pipeline-pulse.zip -d pipeline-pulse
cd pipeline-pulse
```

### 2. Verify it builds locally

```bash
bun install
bun run dev      # http://localhost:5173 — sanity check
bun run build    # production build must succeed before you push
```

### 3. Initialize git

```bash
git init -b main
git add .
git commit -m "chore: initial commit — Pipeline Pulse"
```

### 4. Create the remote repo

**With GitHub CLI:**

```bash
gh repo create pipeline-pulse --public --source=. --remote=origin --push
```

**Without GitHub CLI:** create an empty repo on github.com (no README, no .gitignore — they already exist), then:

```bash
git remote add origin git@github.com:<your-user>/pipeline-pulse.git
git push -u origin main
```

### 5. (Optional) Wire up CI

A starter GitHub Actions workflow is included at
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml). It runs `bun install`
and `bun run build` on every push and PR.

### 6. (Optional) Deploy

The project targets **Cloudflare Workers** via `@cloudflare/vite-plugin` and
`wrangler.jsonc`. To deploy from your own account:

```bash
bunx wrangler login
bunx wrangler deploy
```

Or keep using Lovable's hosting at `https://pipeline-pulse-79.lovable.app`.

---

## Files included to make the repo production-ready

| File                            | Purpose                                                     |
| ------------------------------- | ----------------------------------------------------------- |
| `README.md`                     | Project overview, features, tech stack, quick start         |
| `LICENSE`                       | MIT license — free to fork and remix                        |
| `CONTRIBUTING.md`               | How to propose changes, branch & commit conventions         |
| `CODE_OF_CONDUCT.md`            | Community standards (Contributor Covenant)                  |
| `SECURITY.md`                   | How to responsibly disclose vulnerabilities                 |
| `.gitignore`                    | Ignores `node_modules`, build output, Wrangler cache, etc.  |
| `.github/workflows/ci.yml`      | GitHub Actions — install + build on every push/PR           |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR checklist                                              |
| `.github/ISSUE_TEMPLATE/`       | Bug report and feature request templates                    |
| `.env.example`                  | Documented env vars (none required today — placeholder)     |

---

## Sanity checklist before you push

- [ ] `bun run build` succeeds
- [ ] `README.md` live demo link points to **your** deployment, not the original
- [ ] No secrets in code (`grep -rE "sk_(live|test)_|AIza|ghp_" src/` returns nothing)
- [ ] `public/demo.mp4` is committed (5 MB — fine for git, would need Git LFS only above ~50 MB)
- [ ] License year & author updated in `LICENSE`

---

## Keeping Lovable and GitHub in sync

If you connected via **Option A**, sync is automatic and bidirectional.
If you pushed manually (**Option B**), you can still connect afterwards — Lovable
will detect the existing repo. See the
[Lovable GitHub docs](https://docs.lovable.dev/integrations/github) for details.
