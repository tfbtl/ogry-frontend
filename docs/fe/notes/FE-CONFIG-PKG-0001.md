# FE-CONFIG-PKG-0001 — Shared Config Package + Minimal Adoption

**document_code:** FE-CONFIG-PKG-0001  
**version:** 1.0.0  
**status:** required  
**authority:** CTO  
**executor:** Implementer AI (Cursor)  
**scope:** packages/config + minimal touches in apps/panel and apps/website composition only

---

## 1) Değişen Dosyalar Listesi

| Dosya | Değişiklik |
|-------|------------|
| packages/config/package.json | Yeni paket. |
| packages/config/tsconfig.json | Yeni. |
| packages/config/src/schema.ts | Yeni; ClientConfig, FeatureFlags tipleri. |
| packages/config/src/normalize.ts | Yeni; normalizeViteClientEnv, normalizeNextPublicEnv, normalizeNextServerEnv (placeholder). |
| packages/config/src/index.ts | Yeni; tek entrypoint export. |
| apps/panel/src/composition/config.ts | import @ogrency/config; normalizeViteClientEnv(import.meta.env); mevcut export isimleri korundu. |
| apps/website/app/composition/config.ts | import @ogrency/config; normalizeNextPublicEnv(process.env); mevcut export isimleri korundu. |
| apps/panel/package.json | "@ogrency/config": "workspace:*" eklendi. |
| apps/website/package.json | "@ogrency/config": "workspace:*" eklendi. |

Server-only (app/server/**) dosyalarına dokunulmadı.

---

## 2) Config Key Mapping Tablosu (sadece key isimleri)

| Canonical (schema) | Vite (normalizeViteClientEnv) | Next public (normalizeNextPublicEnv) |
|-------------------|------------------------------|--------------------------------------|
| supabaseUrl | VITE_SUPABASE_URL | NEXT_PUBLIC_SUPABASE_URL |
| supabaseAnonKey | VITE_SUPABASE_ANON_KEY veya VITE_SUPABASE_KEY | NEXT_PUBLIC_SUPABASE_ANON_KEY |
| apiUrl | VITE_API_URL | NEXT_PUBLIC_API_URL |
| featureFlags.useBackendCabins | VITE_USE_BACKEND_CABINS | NEXT_PUBLIC_USE_BACKEND_CABINS |

---

## 3) Backward Compat Kanıtı (VITE_SUPABASE_KEY ve VITE_SUPABASE_ANON_KEY)

- **normalize.ts:** `supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_KEY || ""`. Önce VITE_SUPABASE_ANON_KEY, yoksa VITE_SUPABASE_KEY kullanılıyor.
- Panel composition root artık env’i bu normalize fonksiyonuna veriyor; mevcut .env.local’daki VITE_SUPABASE_ANON_KEY veya eski VITE_SUPABASE_KEY ile çalışmaya devam eder.

---

## 4) Verification Çıktıları

| Adım | Komut / eylem | Sonuç |
|------|----------------|--------|
| Lint | `pnpm run lint` | Başarılı (2 tasks: panel, website). |
| Build | `pnpm run build` | Başarılı; panel (vite build), website (next build) tamamlandı. |
| Panel dev | `pnpm --filter @ogrency/panel dev` | Vite ready; Local: http://localhost:5175/ (5173, 5174 kullanımda olduğu için 5175). |
| Website dev | `pnpm --filter @ogrency/website dev` | Lock conflict (mevcut next dev instance); build ve lint geçti, dev port 3001 hedeflendi. |

Env okuma sadece composition root’ta; packages/config içinde env okuma yok.
