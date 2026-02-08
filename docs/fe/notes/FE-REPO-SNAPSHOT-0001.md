# FE-REPO-SNAPSHOT-0001 — Repo Snapshot (Readiness)

Rapor yalnızca repoda **olanı** belgeler. Öneri, “yapılmalı”, “ileride” ifadeleri kullanılmamıştır.

---

## 1) Amaç & Kapsam

- **Amaç:** Reponun mevcut durumunu (mimari, contract, hata yapısı, auth, validation/i18n, Swagger, frontend hizalaması) tek belgede özetlemek.
- **Kapsam:** ogry-frontend monorepo (root, apps/panel, apps/website, packages/*, tools/*, docs/fe). Build/test/lint çalıştırılmadı; sadece repo okundu.

---

## 2) Repo Genel Haritası

- **Kök:** package.json (pnpm workspace), pnpm-workspace.yaml, turbo.json, .gitignore, README.md, GOVERNANCE.md, CONTRIBUTING.md.
- **apps:** panel (Vite + React), website (Next.js App Router). README’de apps/mobile placeholder olarak geçiyor; dizin listesinde yok.
- **packages:** cabins, core, eslint-config, http, tsconfig, providers/supabase-public. Workspace’te `apps/*`, `packages/*`, `packages/providers/*` tanımlı.
- **tools:** tools/gates — validate-env-and-imports.mjs, validate-folder-structure.mjs.
- **docs:** docs/fe (frontend-blueprint-tree.md, notes/*), docs/onboarding, docs/playbooks. docs/fe altında folder-conventions.md, i18n-conventions.md, validation-strategy.md, ai-maintenance.md referans ediliyor; bu dosyalar repoda yok.

---

## 3) Mimari Snapshot

- **Panel (apps/panel/src):** composition (config.ts, supabasePublicClient.ts), devtools, features (authentication, bookings, cabins, check-in-out, dashboard, pages, settings, users), lib (context, data, hooks, services, shared, utils), styles, ui. Entry: main.jsx, App.jsx.
- **Website (apps/website/app):** composition (config.ts, supabasePublicClient.ts), server (auth.js, supabase.js), lib (actions, api, auth, components, data, data-service, features, services, shared), api (auth/[...nextauth], cabins/[cabinId]), route klasörleri (about, account, cabins, login, vb.). Global: layout.js, globals.css, loading.js, error.js, not-found.js.
- **Blueprint v2.4.0:** SSOT docs/fe/frontend-blueprint-tree.md. Underscoreless isimlendirme; composition, server, lib kök isimleri. Website için route detection ve allowlist (composition, server, lib, i18n). Panel için allowlist: composition, ui, lib, features, assets, styles, devtools.
- **Paket yapısı:** core (Result, AppError), http (HttpClient, problemDetails), cabins (domain types), supabase-public (createSupabasePublicClient). Blueprint’te tarif edilen localization-keys, localization-bundles, runtime, domains/*, contract-tests paketleri repoda yok.

---

## 4) API Contract Snapshot

- **SSOT:** apps/panel/docs/standards/fe-backend-contract.md (Version 1.0.0). Kapsam: ogry-panel + ogry-website.
- **Base URL:** Dokümanda `/api/v1` pattern, URL versioning.
- **Headers:** X-Correlation-Id (required), Authorization: Bearer (authenticated endpoints). Repo içi kodda X-Correlation-Id kullanımı yok.
- **Response:** Adapter backend yanıtını Result&lt;T&gt; yapıyor; UI Result doğrudan almıyor. Hata: RFC7807 ProblemDetails → AppError.
- **Endpoint grupları:** Cabins (GET/POST/PUT/DELETE), Auth (login, logout, session), Bookings (GET/PATCH/DELETE), Settings (GET/PATCH singleton), Users (signup, GET/me, PATCH/me). PagedResponse&lt;T&gt;, domain modelleri (Cabin, Booking, AuthSession, UserProfile, Settings) dokümanda tanımlı.
- **Provider farkları:** Panel Supabase (geçici); website NextAuth (OAuth). Contract’ta website için login/logout NOT_IMPLEMENTED, getSession uygulanmış olarak belgeleniyor.

---

## 5) Error Contract Snapshot

- **packages/core:** AppError (code, messageKey, details?, traceId?, httpStatus?, clientTimestamp, validationErrors?). UIFriendlyError (title, description?, traceId?, fieldErrors?). Result&lt;T&gt; = { ok: true, data: T } | { ok: false, error: AppError }.
- **packages/http/problemDetails.ts:** RFC7807 + eklentiler (code, messageKey, validationErrors, traceId). isProblemDetails(payload), toAppError(payload, httpStatus?). validationErrors veya errors alanı normalize ediliyor.
- **fe-backend-contract.md:** HTTP status → error code (400 VALIDATION_ERROR, 401 UNAUTHORIZED, 403 FORBIDDEN, 404 NOT_FOUND, 409 CONFLICT, 500 INTERNAL_ERROR). 401 → SessionExpired event, 403 → UI karar verir.

---

## 6) Validation & i18n Uyumu

- **Validation:** Contract’ta backend RFC7807 validation errors; problemDetails validationErrors/errors map’liyor. Repoda Zod veya başka bir validation kütüphanesi yok. Blueprint ve playbooks’ta Zod + messageKey ve “backend authority” geçiyor; packages’ta validation veya domains/validation dizini yok.
- **i18n:** Blueprint’te hybrid i18n (localization-keys SSOT, localization-bundles, app overrides). FE-GATE-0005 website allowlist’te i18n kök klasörü var. Repoda packages/localization-keys, packages/localization-bundles yok; apps/website/app/i18n yok. AppError.messageKey “errors.unexpected” gibi key; çeviri bundle’ları repoda yok.

---

## 7) Auth & Security Snapshot (High-Level)

- **Website:** NextAuth (app/server/auth.js), Google provider. AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET. Route api/auth/[...nextauth] → server/auth GET/POST. signIn callback: getGuest/createGuest (lib/data-service). Session callback: guestId ekleniyor. server-only import; env server tarafında.
- **Panel:** Supabase ile auth; composition’dan supabaseUrl/supabaseAnonKey. IAuthService adapter’ları (login, logout, getSession) fe-backend-contract’ta tarif ediliyor.
- **Env:** Panel: composition’da VITE_SUPABASE_URL, VITE_SUPABASE_KEY, VITE_API_URL, VITE_USE_BACKEND_CABINS. Website: composition’da NEXT_PUBLIC_*; server’da AUTH_GOOGLE_*.
- **Gates:** validate-env-and-imports (Rule A: env sadece composition/server, Rule D: server boundary). Client kodun server modül import etmesi yasak.

---

## 8) Swagger / OpenAPI Durumu

- Repoda swagger.*, openapi.* veya *openapi*.yaml/json dosyası yok. Blueprint’te contract-tests/specs (Backend artifacts: OpenAPI / JSON schema) tarif edilir; packages/contract-tests veya specs dizini yok.

---

## 9) Frontend Hizalaması İçin Gözlemler

- **FE-HANDOVER-0001:** Altyapı tamamlandı; validate:env-imports, validate:folder-structure aktif; Blueprint v2.4.0, underscoreless; Legacy Adapter Migration tamamlandı; folder structure enforcement aktif.
- **FE-STRUCTURE-ALIGN-0001:** Panel root klasörleri lib altına (context, data, hooks, services, shared, utils), pages → features/pages; website _styles → globals.css, _components → lib/components.
- **Blueprint vs mevcut:** Blueprint’te packages içinde localization-keys, localization-bundles, runtime, domains, contract-tests ve docs/fe altında folder-conventions, i18n-conventions, validation-strategy, ai-maintenance tarif edilir; bunlar repoda mevcut değil. Panel’de core yapısı result/, errors/, logger/ yerine düz src (Result.ts, AppError.ts, index.ts).

---

## 10) Açık Sorular / Belirsizlikler (Varsayım YOK)

- Backend base URL’in runtime’da nereden geldiği (VITE_API_URL / NEXT_PUBLIC_API_URL) repoda sabit değil; ortam değişkeni bekleniyor. Backend’in gerçek base URL’i ve ortamlar bu repoda tanımlı değil.
- X-Correlation-Id fe-backend-contract’ta zorunlu; uygulama kodunda bu header’ın gönderilip gönderilmediği bu snapshot’ta doğrulanmadı (grep sonucu kullanım yok).
- docs/fe’de referans edilen folder-conventions.md, i18n-conventions.md, validation-strategy.md, ai-maintenance.md dosyalarının repoda olmaması: Blueprint ile mevcut docs dizini tutarsız.
- Blueprint’teki packages (localization-keys, localization-bundles, runtime, domains, contract-tests) ile mevcut packages (core, http, cabins, eslint-config, tsconfig, providers/supabase-public) listesi farklı; hangi dokümanın “mevcut durum” SSOT’u olduğu bu rapor kapsamında netleştirilmedi.
- Website’te NextAuth kullanılırken contract’taki Auth endpoint’leri (POST /auth/login, POST /auth/logout, GET /auth/session) ile gerçek çağrı akışı (NextAuth API route vs backend /api/v1) arasındaki ilişki bu repoda tek bir yerde özetlenmiyor.

---

**Doğrulama:** Sadece repo okundu; build, test, lint çalıştırılmadı.
