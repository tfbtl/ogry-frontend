# docs/fe/frontend-blueprint-tree.md
# Ogrency Frontend Platform — Unified Blueprint Tree (LOCKED) — v2.0

Bu doküman, **Ogrency Frontend Platform** için klasör ağacının (tree) tek gerçek kaynağıdır (SSOT).
Amaç: Airbnb/Udemy ölçeğinde **deterministik**, **provider-agnostic**, **platform-agnostic** monorepo.

> Referans: `docs/fe/folder-conventions.md` (Unified Folder & Naming Conventions — SSOT)

---

## 0) Kırmızı Çizgiler (Özet)

- **pnpm ONLY**, tek lock
- **packages/** içinde: ❌ env okuma ❌ window/document/storage ❌ next/* ❌ react ❌ axios/fetch/supabase import
- **Website Server Boundary**: server-only kod TEK yerde → `apps/website/src/server/**` + `import "server-only";`
- **Adapters**:
  - Website: `src/adapters/**` = client-only, `src/server/adapters/**` = server-only
  - Panel: `src/adapters/**` = client-only
- **CQRS**: `src/cqrs/**` sadece state/cache policy; infra import yok
- **Composition Root**: `src/composition/**` sadece DI/singleton üretimi; business logic yok
- **Sealed exports**: package entrypoint yalnız `"."`, deep import yasak

---

## 1) Monorepo Root Tree

```txt
.
├── apps/                                  # Composition roots (env + DI + routing + UI)
│   ├── panel/                             # Vite SPA (pure client)
│   ├── website/                           # Next.js App Router (hybrid: server + client)
│   └── mobile/                            # Expo (planned)
│
├── packages/                              # Portable building blocks (platform-agnostic)
│   ├── core/                              # Result/AppError/primitives (saf çekirdek)
│   ├── runtime/                           # runtime abstractions (ids/time) — injectable
│   ├── http/                              # HttpClient (axios only here)
│   ├── providers/
│   │   └── supabase-public/               # SSOT factory: createSupabasePublicClient(config)
│   ├── ui/
│   │   ├── ui-headless/                   # logic-only UI patterns (NO DOM, NO RN primitives)
│   │   ├── ui-web/                        # React DOM components (web-only)
│   │   └── ui-native/                     # React Native components (native-only)
│   └── domains/
│       ├── cabins/
│       │   ├── contracts/                 # SSOT types only (NO functions, NO enums)
│       │   └── application/               # CQRS handlers + ports (provider-agnostic)
│       ├── bookings/
│       │   ├── contracts/
│       │   └── application/
│       └── auth/
│           ├── contracts/
│           └── application/
│
├── tooling/                               # boundary rules, forbidden scans, scripts
└── docs/
    └── fe/
        ├── folder-conventions.md          # SSOT: unified conventions
        └── frontend-blueprint-tree.md     # (this file) SSOT: target tree
```

---

## 2) PACKAGES — Target Trees (Portable)

### 2.1) packages/core (Shared Kernel)

```
packages/core/
├── src/
│   ├── result.ts                          # Result<T, E> (AppError)
│   ├── errors/                            # AppError, mapping helpers (PII-safe)
│   └── primitives/                        # immutable primitives only
└── package.json                           # sealed exports (".")
```

### 2.2) packages/runtime (Injectable runtime abstractions)

```
packages/runtime/
├── src/
│   ├── ids/                               # IdProvider interfaces (no crypto here)
│   └── time/                              # TimeProvider interfaces
└── package.json                           # sealed exports (".")
```

### 2.3) packages/http (Network layer)

```
packages/http/
├── src/
│   ├── HttpClient.ts                      # axios wrapper ONLY here
│   └── types.ts
└── package.json                           # sealed exports (".")
```

### 2.4) packages/providers/supabase-public (Public Supabase factory)

```
packages/providers/supabase-public/
├── src/
│   ├── index.ts                           # public entrypoint
│   └── createSupabasePublicClient.ts      # factory(config) — no env
└── package.json                           # sealed exports (".")
```

### 2.5) packages/ui (Design System split)

```
packages/ui/
├── ui-headless/
│   ├── src/                               # headless patterns only (no DOM/RN)
│   └── package.json
├── ui-web/
│   ├── src/                               # web components (Tailwind ok)
│   └── package.json
└── ui-native/
    ├── src/                               # RN components
    └── package.json
```

### 2.6) packages/domains/<domain> (Contracts vs Application split)

#### 2.6.1) Domain Contracts (SSOT: types only)

```
packages/domains/cabins/contracts/
├── src/
│   ├── index.ts                           # ONLY export surface
│   ├── types.ts                           # CabinId, Cabin, CabinListItem, CabinDetail...
│   ├── dtos.ts                            # Create/Update inputs, list response, PageInfo...
│   └── constants.ts                       # string unions + `as const` maps (no enums)
└── package.json                           # sealed exports (".")
```

**Contracts rules (hard):**
- ❌ NO exported functions (type guards dahil)
- ❌ NO enum / const enum
- ❌ NO query keys (cache concern)
- ❌ NO provider details (Supabase column names birebir kopyalama yok)

#### 2.6.2) Domain Application (CQRS: ports + handlers)

```
packages/domains/cabins/application/
├── src/
│   ├── ports/
│   │   ├── CabinsReadPort.ts              # interface only
│   │   └── CabinsWritePort.ts             # interface only
│   ├── queries/
│   │   ├── listCabins/
│   │   │   ├── query.ts
│   │   │   ├── result.ts
│   │   │   └── handler.ts                 # port -> Result<DTO, AppError>
│   │   └── getCabinById/
│   └── commands/
│       ├── createCabin/
│       └── updateCabin/
└── package.json                           # depends on: cabins/contracts + core
```

---

## 3) APPS — Target Trees (Unified Mental Model)

### 3.1) apps/website (Next.js App Router — Routing-only app/ + src core)

```
apps/website/
├── app/                                   # ROUTING & LAYOUTS ONLY
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (marketing)/
│   ├── (app)/
│   └── api/                               # route handlers (if used)
│
├── src/                                   # APPLICATION CORE
│   ├── config/                            # typed PUBLIC config (NEXT_PUBLIC_*)
│   ├── composition/                       # DI root (client singletons)
│   │   ├── supabasePublicClient.ts        # can include: import "client-only";
│   │   └── httpClient.ts
│   │
│   ├── server/                            # SERVER-ONLY BOUNDARY (TEK GERÇEK) 🔒
│   │   ├── auth.ts                        # import "server-only";
│   │   ├── supabaseAdminClient.ts         # import "server-only";
│   │   └── adapters/
│   │       └── cabins/
│   │           └── CabinsReadAdapterSupabase.server.ts
│   │
│   ├── adapters/                          # CLIENT ADAPTERS ONLY (browser)
│   │   └── cabins/
│   │       └── CabinsReadAdapterHttp.client.ts
│   │
│   ├── cqrs/                              # CLIENT STATE (hooks + keys + cache policy)
│   │   └── cabins/
│   │       ├── queries/
│   │       ├── commands/
│   │       └── keys.ts
│   │
│   ├── features/                          # VERTICAL SLICES (domain UI)
│   │   └── cabins/
│   │       ├── ui/                        # dumb/presentational components
│   │       ├── rsc/                       # smart server components (async)
│   │       └── client/                    # smart client components (interactive)
│   │
│   ├── components/                        # app-wide UI only (domain-agnostic, limited)
│   └── lib/                               # pure utils/constants only (no data fetching)
│
├── next.config.js                          # transpilePackages: used @ogrency/*
└── package.json
```

**Website guard rules:**
- `src/server/**` her dosyada `import "server-only";` zorunlu
- `src/composition/**` içinde client-only singleton dosyaları gerekiyorsa `import "client-only";`
- `.server.ts` / `.client.ts` suffix zorunlu (lint/gate ileride)

### 3.2) apps/panel (Vite SPA — Pure client)

```
apps/panel/
├── src/
│   ├── main.tsx                           # entry point
│   ├── router/                            # routing config
│   ├── config/                            # typed env config (VITE_*)
│   ├── composition/                       # DI root (clients/singletons)
│   ├── adapters/                          # CLIENT ADAPTERS ONLY
│   │   └── cabins/
│   │       ├── CabinsReadAdapterSupabase.client.ts
│   │       └── CabinsWriteAdapterSupabase.client.ts
│   ├── cqrs/                              # hooks + keys + cache policy
│   │   └── cabins/
│   │       ├── queries/
│   │       ├── commands/
│   │       └── keys.ts
│   ├── features/                          # vertical slices
│   │   └── cabins/
│   │       ├── ui/                        # dumb components
│   │       └── pages/                     # smart pages (client-only containers)
│   ├── components/                        # app-wide UI only (limited)
│   └── lib/                               # pure utils/constants only
│
└── package.json
```

**Panel strict rule:**
- ❌ `src/server/` YASAKTIR (asla oluşmayacak)

### 3.3) apps/mobile (Expo — Planned, mirrors Panel mental model)

```
apps/mobile/
├── src/
│   ├── config/                            # Expo env config
│   ├── composition/                       # DI root
│   ├── adapters/                          # client adapters
│   ├── cqrs/                              # hooks + keys
│   ├── features/
│   │   └── cabins/
│   │       ├── ui/
│   │       └── screens/                   # smart containers (native)
│   ├── components/
│   └── lib/
└── package.json
```

---

## 4) File Naming & Suffix Convention (MANDATORY)

- `*.server.ts` → server-only (Website `src/server/**` içinde)
- `*.client.ts` → client-only (browser / SPA / RN)

**UI bileşenleri:**
- Website RSC: `*.server.tsx` (veya `.tsx` + klasör `rsc/`)
- Website client components: `*.client.tsx` (veya `.tsx` + klasör `client/`)

Bu kural, ileride tooling ile lint/gate'e bağlanacaktır.

---

## 5) Bootstrap Notu (Cursor için uygulama sırası)

Bu tree dokümanını repo'ya ekle:
- `docs/fe/frontend-blueprint-tree.md`
- `docs/fe/folder-conventions.md` ile birlikte SSOT olarak kilitle

Cursor, bu tree'ye göre eksik klasörleri boş olarak oluşturabilir (no code change)

**Sonra sırayla:**
1. FE-PLATFORM-0001-D: `packages/domains/cabins/contracts`
2. FE-PLATFORM-0001-E: `packages/domains/cabins/application`
3. FE-APP-ADAPTER-0001: apps adapters (ports implement)
4. FE-APP-CQRS-0001: hooks + keys + cache policy

---

## 6) "Ne nereye gider?" hızlı kılavuz

| Ne? | Nereye? |
|-----|---------|
| Contract (type/DTO) | `packages/domains/<domain>/contracts` |
| Use-case handler + ports | `packages/domains/<domain>/application` |
| Provider binding (supabase/http) | `apps/*/src/adapters/**` (website server tarafı hariç) |
| Secrets/admin/auth | `apps/website/src/server/**` |
| Cache policy, keys, hooks | `apps/*/src/cqrs/**` |
| Dikey UI dilimi | `apps/*/src/features/<domain>/**` |
| App-wide UI | `apps/*/src/components/**` (çok sınırlı) |
| Pure helpers | `apps/*/src/lib/**` (side-effect yok) |

