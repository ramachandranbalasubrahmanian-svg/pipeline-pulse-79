# Contributing to Pipeline Pulse

Thanks for taking the time to contribute! This project is a Lovable-built
demo — small PRs are welcome.

## Development

```bash
bun install
bun run dev       # http://localhost:5173
bun run build     # production build
```

## Branch & commit conventions

- Branch from `main`: `git checkout -b feat/short-description`
- Use [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: add tenant filter to billing`
  - `fix: correct lineage edge rendering`
  - `chore: bump dependencies`
  - `docs: clarify deploy steps`

## Pull request checklist

- [ ] `bun run build` succeeds locally
- [ ] No hard-coded colors — use semantic tokens from `src/styles.css`
- [ ] New routes live in `src/routes/` (TanStack Start file-based routing)
- [ ] Screenshots attached for UI changes

## Reporting bugs / requesting features

Use the issue templates in `.github/ISSUE_TEMPLATE/`.
