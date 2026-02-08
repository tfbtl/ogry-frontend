# FE-CONFIG-DEPRECATION-0001 — Remove VITE_SUPABASE_KEY Fallback (No Tech Debt)

**document_code:** FE-CONFIG-DEPRECATION-0001  
**version:** 1.0.0  
**status:** required  
**authority:** CTO  
**scope:** packages/config + panel env examples/docs (minimal)

---

## 1) Amaç

VITE_SUPABASE_KEY backward-compat fallback’ini tamamen kaldırmak; repo içi örnek ve dokümanları canonical key olan VITE_SUPABASE_ANON_KEY’e sabitlemek. Teknik borç bırakmamak.

---

## 2) Değişen Dosyalar

| Dosya | Değişiklik |
|-------|------------|
| packages/config/src/normalize.ts | supabaseAnonKey yalnızca VITE_SUPABASE_ANON_KEY; VITE_SUPABASE_KEY kaldırıldı. ImportMetaEnvLike’dan VITE_SUPABASE_KEY çıkarıldı. |
| docs/fe/standards/FE-CONFIG-SSOT-0001.md | Panel mapping: "(veya VITE_SUPABASE_KEY compat)" kaldırıldı. Backward compat bölümü: fallback kaldırıldığı belirtildi. Examples: VITE_SUPABASE_ANON_KEY tek key. |
| docs/fe/notes/FE-CONFIG-CLOSE-0001.md | Backward compatibility window: "fallback kaldırıldı (FE-CONFIG-DEPRECATION-0001)" olarak güncellendi. |

**Dokunulmayan:** apps/panel/.env.example zaten VITE_SUPABASE_ANON_KEY kullanıyordu; değişiklik yok. apps/panel/.env.local .gitignore’da (.env.*); repo içinde değiştirilmedi.

---

## 3) Kaldırılan Backward-Compat (kanıt)

- **Önce (normalize.ts):** `supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_KEY || ""`
- **Sonra (normalize.ts):** `supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY ?? ""`

ImportMetaEnvLike interface’inden VITE_SUPABASE_KEY alanı kaldırıldı. JSDoc’taki "Backward compat: VITE_SUPABASE_KEY..." cümlesi kaldırıldı.

---

## 4) Verification Çıktıları

| Adım | Sonuç |
|------|--------|
| Lint | `pnpm run lint` — 2 successful (panel, website). |
| Build | `pnpm run build` — panel (vite build), website (next build) başarılı. |
| Panel dev | `pnpm --filter @ogrency/panel dev` — Vite ready; Local: http://localhost:5176/ (port 5176). |

VITE_SUPABASE_ANON_KEY tanımlı ortamda crash beklenmez. Key yoksa "supabaseKey is required" beklenen davranıştır.

---

## 5) Sonuç

Fallback kaldırıldı; dokümanlar canonical key’e göre güncellendi. UI, refactor ve env okuma kuralı değişmedi.
