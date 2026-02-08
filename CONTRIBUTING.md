# Contributing — Ogrency Frontend Monorepo

This is the **Handbook** for contributors. For binding policy see [GOVERNANCE.md](./GOVERNANCE.md).

---

## 1) Quick Start

### Branch creation

Use a branch prefix that matches your change:

```bash
git checkout -b feature/my-feature
# or: fix/issue-123, chore/deps, refactor/api-layer, hotfix/login-crash
```

### Local checks (run before opening a PR)

From the **repository root**:

```bash
pnpm -w run validate:env-imports
pnpm -w run lint
pnpm -w run build
```

If `test` exists in root `package.json`:

```bash
pnpm -w run test
```

All of these MUST pass before you merge. CI will run the same checks.

---

## 2) PR Checklist

Before requesting review, ensure:

- [ ] **What changed / Why** — Summary of changes and reason (e.g. ticket, bug, tech debt).
- [ ] **Verification** — You ran `validate:env-imports`, `lint`, and `build` (and `test` if applicable) and they pass.
- [ ] **Risk notes** — Any behavioral change, config change, or boundary touch; call out if docs or gates were updated.
- [ ] **SSOT docs touched** — If you changed anything under `docs/fe/` (e.g. blueprint, notes), say so and ensure it stays consistent with [GOVERNANCE.md](./GOVERNANCE.md).

---

## 3) Inline PR Template (copy-paste)

Use this in the PR description:

```markdown
## Title
[Conventional style, e.g. feat(website): add cabin filters]

## Description
- What changed
- Why (ticket / bug / refactor)

## Verification
- [ ] `pnpm -w run validate:env-imports` — PASS
- [ ] `pnpm -w run lint` — PASS
- [ ] `pnpm -w run build` — PASS
- [ ] `pnpm -w run test` — PASS (if applicable)

## Risk
- [ ] No behavior change / [ ] Config or boundary change (describe)

## References
- SSOT docs touched: (none / list)
- Ticket / incident: (if any)
```

---

## 4) Hard Stops (Do Not Merge)

Do **not** merge a PR if any of the following apply:

- **Gate fail** — `validate:env-imports` fails (env read outside composition/server, direct Supabase SDK outside allowed zones, deep imports, server boundary violation).
- **Client importing server code** — Any "use client" or client bundle importing from `server/**` (or equivalent server-only path).
- **Deep imports** — Imports into `@ogrency/*/src`, `@ogrency/*/dist`, or `@ogrency/*/lib`; only `@ogrency/<pkg>` root is allowed.
- **Env read outside boundaries** — `process.env` / `import.meta.env` only in `composition/**` or `server/**` as per Blueprint v2.4.0.
- **Unapproved folder invention** — New top-level or app-level folders that are not in the Blueprint (e.g. `_composition`, `_server`, `_lib` are forbidden; use `composition`, `server`, `lib`).

If in doubt, stop and align with the Tech Lead or SSOT docs (`docs/fe/frontend-blueprint-tree.md`).

---

*For governance and Break Glass protocol see [GOVERNANCE.md](./GOVERNANCE.md).*
