# FE-RUN-SMOKE-0001 — Start Panel + Website (Supabase Smoke Check)

**document_code:** FE-RUN-SMOKE-0001  
**version:** 1.0.0  
**status:** required  
**authority:** CTO  
**executor:** Implementer AI (Cursor)  
**scope:** ogry-frontend monorepo (RUN-ONLY)  
**risk:** low (no code change; runtime only)  
**intent:** Refactor sonrası FE'nin Supabase üzerinden hâlâ çalıştığını doğrulamak için panel ve website uygulamalarını lokal ortamda ayağa kaldırmak, portları raporlamak ve hata varsa kanıtlı loglarla bildirmek.

---

## 1) Amaç & Kapsam

- **Amaç:** apps/panel (Vite) ve apps/website (Next.js) uygulamalarını çalıştırmak; her birinin URL/PORT bilgisini raporlamak; başlatma sırasında hata/uyarı varsa komut çıktısı ve kanıtı rapora yazmak. Feature test/QA yapılmaz.
- **Kapsam:** ogry-frontend monorepo; RUN-ONLY (kod değişikliği yok).

---

## 2) Ortam Özeti (Node, pnpm, OS)

| Öğe | Değer |
|-----|--------|
| Node | v22.20.0 |
| pnpm | 9.15.0 |
| OS | Windows 10.0.26200.0 |
| Repo | D:\BtaArge\Ogrency.com\ogry-frontend |

**Ön koşul kontrolleri (read-only):**
- `pnpm-workspace.yaml` mevcut; `packages: apps/*, packages/*, packages/providers/*`.
- Root `package.json` scripts: `dev` = `turbo run dev --parallel`.
- `.env*` dosyaları: `apps/panel/.env.local`, `apps/panel/.env.example`, `apps/website/.env.local`, `apps/website/.env.example` (içerik yazılmadı).
- Panel: `apps/panel/src/composition/config.ts`, `supabasePublicClient.ts` mevcut.
- Website: `apps/website/app/composition/config.ts`, `supabasePublicClient.ts`; `app/server/auth.js`, `app/server/supabase.js`; `app/api/auth/[...nextauth]/route.js` mevcut.

---

## 3) Çalıştırılan Komutlar

| Adım | Komut | Açıklama |
|------|--------|----------|
| Install | `pnpm -w install` | Root'ta bağımlılıklar güncellendi (Already up to date). |
| Panel dev | `pnpm --filter @ogrency/panel dev` | Vite dev server. |
| Website dev | `pnpm --filter @ogrency/website dev` | Next.js dev server. |

Filter isimleri: `apps/panel/package.json` → `"name":"@ogrency/panel"`; `apps/website/package.json` → `"name":"@ogrency/website"`. Script'ler: panel `"dev":"vite"`, website `"dev":"next dev"`.

---

## 4) Panel Sonuçları (URL/PORT + log özeti)

| Öğe | Değer |
|-----|--------|
| Local URL | http://localhost:5173/ |
| Port | 5173 |
| Ready sinyali | `VITE v7.3.1  ready in 781 ms` |
| Log özeti | Başlatma sırasında Supabase env eksik hatası yok. Çıktı: `Local: http://localhost:5173/`, `Network: use --host to expose`. |

---

## 5) Website Sonuçları (URL/PORT + log özeti)

| Öğe | Değer |
|-----|--------|
| Local URL | http://localhost:3000 |
| Port | 3000 |
| Ready sinyali | `✓ Ready in 8.8s` |
| Log özeti | Next.js 16.1.1 (Turbopack). Environments: .env.local. Uyarı: "The \"middleware\" file convention is deprecated. Please use \"proxy\" instead." NextAuth/Supabase runtime error veya server-only import hatası görülmedi. |

---

## 6) Supabase/Env Durumu (env isimleri; değer YOK)

**Panel (Vite):**  
- `VITE_SUPABASE_URL`  
- `VITE_SUPABASE_KEY`  
- `VITE_API_URL`  
- `VITE_USE_BACKEND_CABINS`  

**Website (Next.js):**  
- `NEXT_PUBLIC_SUPABASE_URL`  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- `NEXT_PUBLIC_API_URL`  
- `NEXT_PUBLIC_USE_BACKEND_CABINS`  

Kaynak: `apps/panel/src/composition/config.ts`, `apps/website/app/composition/config.ts`. Değerler rapora yazılmadı.

---

## 7) Hatalar / Uyarılar (varsa, kanıtlı)

| Uygulama | Tür | Özet | Kanıt |
|----------|-----|------|--------|
| Website | Uyarı | Middleware convention deprecated; "proxy" kullanılması öneriliyor. | Log: `⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.` |

Panel için hata/uyarı yok. Env eksikliği nedeniyle dev server kalkmama durumu yok.

---

## 8) Sonuç

**PASS**

Her iki uygulama ayağa kalktı; panel http://localhost:5173, website http://localhost:3000. Başlatma sırasında Supabase/NextAuth ile ilgili runtime hatası veya env eksikliği hatası oluşmadı. Tek uyarı: Next.js middleware deprecation (kod değişikliği talep edilmedi).
