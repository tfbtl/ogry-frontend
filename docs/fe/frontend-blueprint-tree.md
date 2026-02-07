# Ogrency Frontend Platform — Blueprint Tree (v2.4.0 UNDERSCORELESS)

status: LOCKED  
authority: Architect + Tech Lead  
scope: ogry-frontend monorepo  
apps: panel (Vite), website (Next.js App Router), future mobile (Expo/RN)

non_negotiables:
- platform-agnostic packages (NO window / document / env)
- strict boundaries (enforced by tooling + CI)
- backend authority (contracts + validation mirror backend)
- hybrid i18n (keys SSOT + shared bundles + app overrides)
- explicit server boundary for website
- deterministic structure (AI-safe, human-safe)
- underscoreless naming (boundaries enforced by gates, not underscores)

naming_decision_v2_4_0:
- "_" prefix in infra folders is FORBIDDEN:
  - _composition ❌
  - _server ❌
  - _lib ❌
- canonical names:
  - composition ✅
  - server ✅
  - lib ✅

---

## 0) MONOREPO ROOT (SSOT)

ogry-frontend/
├── apps/                                   # Runtime applications
│   ├── panel/                              # Vite + React (client-only)
│   ├── website/                            # Next.js App Router (hybrid)
│   └── mobile/                             # (future) Expo / React Native
│
├── packages/                               # Platform-agnostic kernel
│   ├── core/                               # Shared primitives (Result, Error, Logger)
│   ├── http/                               # Network abstraction (axios wrapper)
│   ├── providers/
│   │   └── supabase-public/                # Public provider factories (NO env)
│   │
│   ├── localization-keys/                  # i18n KEYS SSOT (types + constants)
│   ├── localization-bundles/               # Shared translations (values only)
│   ├── runtime/                            # Formatters, cache, ids, i18n helpers
│   ├── ui/                                 # (optional) ui-headless / ui-web / ui-native
│   │
│   ├── domains/                            # Business domains (Clean Architecture)
│   │   ├── cabins/
│   │   │   ├── contracts/                  # Types + DTOs (NO logic)
│   │   │   ├── validation/                 # Zod schemas (keys only)
│   │   │   └── application/                # Ports + intents (CQRS core)
│   │   ├── bookings/
│   │   └── auth/
│   │
│   └── contract-tests/                     # Frontend ↔ Backend contract tests
│       ├── specs/                          # Backend artifacts (OpenAPI / JSON schema)
│       ├── tests/
│       └── README.md
│
├── tooling/                                # "Docs değil, kanun"
│   └── eslint-config-ogrency/              # boundaries + forbidden imports
│
├── tools/                                  # local gates / scripts (repo toolchain)
│   └── gates/                              # CI hard-fail checks
│       ├── validate-env-and-imports.mjs
│       └── (other gates...)
│
├── docs/
│   └── fe/
│       ├── frontend-blueprint-tree.md      # THIS DOCUMENT (SSOT)
│       ├── folder-conventions.md            # boundaries + naming rules
│       ├── i18n-conventions.md              # hybrid i18n + gates
│       ├── validation-strategy.md           # backend authority & args
│       └── ai-maintenance.md                # logging + observability (phase-2)
│
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── turbo.json

---

## 1) PACKAGES — CORE PLATFORM (PORTABLE)

### 1.1 packages/core — Shared Kernel (SSOT)

packages/core/
├── src/
│   ├── result/
│   │   └── Result.ts                        # Ok / Err primitive
│   │
│   ├── errors/
│   │   ├── AppError.ts                     # Root error type
│   │   ├── sanitize.ts                     # 🔒 Prod-safe error surface
│   │   └── index.ts
│   │
│   ├── logger/
│   │   ├── StructuredLogger.ts             # JSON structured logger
│   │   └── index.ts
│   │
│   ├── guards/                             # Assertions & invariants
│   └── index.ts                            # Sealed exports
└── package.json

rules:
- NO console.log in apps
- logger injected at app composition root
- sanitize() used before exposing errors to UI

---

### 1.2 packages/http — Network Layer

packages/http/
├── src/
│   ├── HttpClient.ts                       # Axios wrapper
│   ├── interceptors.ts                    # Auth / logging
│   └── index.ts
└── package.json

rules:
- axios ONLY lives here
- uses core/logger for tracing
- NO domain knowledge

---

### 1.3 packages/providers/supabase-public

packages/providers/supabase-public/
├── src/
│   ├── createClient.ts                    # Factory (NO env access)
│   └── index.ts
└── package.json

rules:
- public only
- admin keys FORBIDDEN

---

## 2) HYBRID i18n ARCHITECTURE (v2.4.0)

### 2.1 packages/localization-keys — KEYS SSOT

packages/localization-keys/
├── src/
│   ├── Common/
│   │   └── common.keys.ts
│   ├── Errors/
│   │   └── errors.keys.ts
│   ├── Validation/
│   │   └── validation.keys.ts
│   ├── Domains/
│   │   ├── Cabins/
│   │   │   └── cabins.keys.ts
│   │   └── ...
│   ├── types.ts
│   ├── manifest.ts
│   └── index.ts
└── package.json

rules:
- keys ONLY (NO values)
- used by backend + frontend
- deep imports FORBIDDEN

---

### 2.2 packages/localization-bundles — SHARED VALUES

packages/localization-bundles/
├── src/
│   └── locales/
│       ├── tr/
│       │   ├── common.json
│       │   ├── errors.json
│       │   └── validation.json
│       └── en/
│           └── ...
└── package.json

rules:
- ONLY common / errors / validation
- NO domain JSON allowed
- app overrides win at runtime

---

### 2.3 apps/* overrides

apps/website/src/i18n/
├── init.ts
└── locales/
    ├── tr/
    │   ├── marketing.json
    │   └── cabins.json
    └── en/
        └── ...

rules:
- app-specific only
- no shared duplication

---

## 3) packages/runtime — PERFORMANCE & FORMATTING

packages/runtime/
├── src/
│   ├── formatters/
│   ├── cache/
│   ├── i18n/
│   ├── ids/
│   └── index.ts
└── package.json

rules:
- pure functions only
- hydration-safe outputs REQUIRED

---

## 4) DOMAINS — TRIPLE LAYER (MANDATORY)

### 4.1 contracts — SHAPE ONLY

packages/domains/cabins/contracts/
├── src/
│   ├── Cabin.ts
│   ├── dtos/
│   └── index.ts
└── package.json

rules:
- NO logic
- backend canonical mirror

---

### 4.2 validation — RULES (KEYS ONLY)

packages/domains/cabins/validation/
├── src/
│   ├── rules/
│   ├── helpers/
│   ├── types/
│   ├── mappers/
│   └── index.ts
└── package.json

rules:
- no literal messages
- backend FluentValidation mirror

---

### 4.3 application — CQRS CORE

packages/domains/cabins/application/
├── src/
│   ├── ports/
│   ├── queries/
│   ├── commands/
│   ├── cache/
│   └── index.ts
└── package.json

rules:
- no React
- no HTTP
- no adapters

---

## 5) APPS STRUCTURE (UNDERSCORELESS)

### 5.1 Website (Next.js)

apps/website/
├── app/                                 # routing only (Next App Router)
│   └── (marketing)/cabins/page.tsx
│
└── src/                                 # app implementation
    ├── server/                          # 🔒 ONLY server zone (no client imports)
    │   ├── adapters/
    │   └── auth.ts
    │
    ├── adapters/
    │   └── client/
    │
    ├── cqrs/
    ├── features/
    ├── composition/                     # DI root (env read + singletons)
    ├── config/                          # optional (non-env config, constants)
    ├── i18n/
    └── lib/

rules:
- server-only imports enforced by gates
- UI must not read env
- adapters never used directly in UI

---

### 5.2 Panel (Vite)

apps/panel/src/
├── adapters/
├── cqrs/
├── features/
├── composition/                         # DI root (env read + singletons)
├── config/
└── i18n/

rules:
- NO server code
- public runtime only

---

## 6) TESTING STRATEGY (MANDATORY)

- Unit tests: co-located
- Integration tests: app/tests or package/tests
- Contract tests: packages/contract-tests (HARD REQUIREMENT)

---

## 7) FORBIDDEN PATTERNS (CI FAIL)

1. packages importing apps
2. UI importing application layer directly
3. hardcoded strings
4. new Date() in UI
5. deep imports
6. underscore infra folders (_composition, _server, _lib)

---

## FINAL NOTE

This blueprint is the single source of truth.  
Any deviation requires explicit architectural approval.

END OF DOCUMENT

