# Governance — Ogrency Frontend Monorepo

**Status:** LOCKED  
**Authority:** CTO + Tech Lead  
**Scope:** Repository-wide policy and enforcement.

This document is the **Constitution** for how work is done in this repository. All contributors and AI agents MUST follow it.

---

## 1) Authority / SSOT (Single Source of Truth)

- **Blueprint v2.4.0:** `docs/fe/frontend-blueprint-tree.md` is the **Technical Constitution**. It defines structure, boundaries, and naming (e.g. underscoreless: `composition`, `server`, `lib`).
- **Gates:** Scripts under `tools/gates/**` (e.g. `validate-env-and-imports.mjs`) are **mandatory enforcers** in CI. They SHALL run on every PR targeting `main`.
- Work MUST NOT contradict SSOT docs. Any change that conflicts with the Blueprint or gate rules requires explicit architectural approval before merge.

---

## 2) Branch Strategy (MANDATORY)

- **`main`** is the protected default branch. It SHALL reflect a deployable state.
- **Default rule:** NO direct pushes to `main`. All changes SHALL land via Pull Request (PR), except under the Emergency Protocol (Break Glass).
- **Work branches** SHALL use one of these prefixes:
  - `feature/*` — New functionality
  - `fix/*` — Bug fixes
  - `chore/*` — Tooling, config, dependencies, docs
  - `refactor/*` — Code structure without changing behavior
  - `hotfix/*` — Emergency fixes (still PR by default; Break Glass only when CI is broken and recovery is urgent)
- **Merge flow:** All changes merge to `main` ONLY via Pull Request, unless Break Glass is invoked (see §6).

---

## 3) Required Checks (CI Handshake)

The following commands MUST pass before a PR can be merged. **Repository script names are fixed;** do not invent commands.

| Check | Command | Required |
|-------|---------|----------|
| Env & imports gate | `pnpm -w run validate:env-imports` | MUST PASS |
| Lint | `pnpm -w run lint` | MUST PASS |
| Build | `pnpm -w run build` | MUST PASS |
| Test | `pnpm -w run test` | MUST PASS (if the script exists in root `package.json`) |

- These checks SHALL be configured as **required status checks** in GitHub Branch Protection for `main`.
- If a referenced command does not exist in the repo, it SHALL NOT be listed as required until added.

---

## 4) Commit Convention (MANDATORY)

- **Conventional Commits** are required. Allowed types:
  - `feat:` — New feature
  - `fix:` — Bug fix
  - `chore:` — Maintenance (deps, config, docs, tooling)
  - `refactor:` — Refactoring
  - `docs:` — Documentation only
  - `test:` — Tests only
- PR title SHOULD align with this convention (e.g. `feat(panel): add X`, `chore(gov): update CONTRIBUTING`).
- Squash or merge commits onto `main` SHOULD preserve a single conventional message for the change.

---

## 5) AI Usage Rules (MANDATORY)

- AI agents MUST read SSOT docs (especially `docs/fe/frontend-blueprint-tree.md` and relevant `docs/fe/notes/*`) before major tasks.
- AI MUST NOT bypass gates (e.g. disable or skip `validate:env-imports`) or force-push to `main`.
- If AI detects boundary violations (env outside composition/server, client importing server, deep imports) or needs a logic/architecture change: **HARD STOP & REPORT** to the Tech Lead. Do not auto-fix in a way that weakens governance.

---

## 6) Emergency Protocol — "Break Glass" (Controlled Admin Bypass)

**Goal:** Allow recovery from catastrophic failure (e.g. CI broken, main unreachable) without making governance a paper tiger.

**Rules:**

- Direct push to `main` is permitted **ONLY for Admins**, and **ONLY** in catastrophic failure scenarios where normal PR flow is not feasible.
- **Any Break Glass push** MUST be followed **within the same day (or next working day)** by:
  1. **Incident Log:** Create `docs/incidents/INC-YYYY-XXX.md` (e.g. `INC-2026-001.md`) describing what failed and why bypass was used.
  2. **Follow-up PR** that:
     - Restores normal governance state (e.g. re-enables or fixes gates),
     - Adds/updates tests or gates if needed,
     - References the incident id in the PR description and commit message.
- Break Glass MUST NOT be used for convenience, speed, or routine work. Misuse SHALL be escalated to CTO.

---

## 7) Enforcement Handshake (CRITICAL)

**This Policy becomes real ONLY when GitHub Branch Protection is enabled.**

Without Branch Protection, the rules above are not technically enforced. The following (FE-GOV-0002) SHALL be applied by the CTO:

- [ ] **Protect `main` branch:** ON
- [ ] **Require a pull request before merging:** ON
- [ ] **Require status checks to pass before merging:** ON  
  - Required checks MUST include: `validate:env-imports`, `lint`, `build` (and `test` if the script exists).
- [ ] **Restrict who can push to matching branches:**  
  - Only allowed roles/teams (e.g. Admins) can push when bypass is needed (Break Glass).
- [ ] **Include administrators:**  
  - **OFF** = Admin can bypass checks in emergencies (Break Glass).  
  - **ON** = Admin must also pass checks (stricter; reduces bypass).
- [ ] **Force pushes:** OFF (for `main`)
- [ ] **Branch deletions:** OFF (for `main`)
- [ ] **If bypass is used:** Incident Log + Follow-up PR is mandatory (see §6).

---

*Last updated: FE-GOV-0001. For implementation details see `docs/fe/notes/FE-GOV-0001.md`.*
