# FE-PANEL-ENV-FIX-0001 — Supabase Env Key Compat Fix (Min-Touch)

**document_code:** FE-PANEL-ENV-FIX-0001  
**version:** 1.0.0  
**status:** required  
**authority:** CTO  
**executor:** Implementer AI (Cursor)  
**scope:** apps/panel ONLY (config)  
**risk:** low (single-file, backward compatible)

---

## 1) Amaç

Panel dev server’da “supabaseKey is required” crash’ini gidermek. FE-PANEL-ENV-PROOF-0001’de tespit edilen env anahtar adı uyumsuzluğunu (config: `VITE_SUPABASE_KEY`, .env: `VITE_SUPABASE_ANON_KEY`) minimum dokunuşla düzeltmek; Supabase tabanlı mevcut akışın tekrar çalışmasını sağlamak.

---

## 2) Değişen Dosya/Satırlar (diff özeti)

**Dosya:** `apps/panel/src/composition/config.ts`

**Değişiklik:** `supabaseAnonKey` için önce `VITE_SUPABASE_KEY`, falsy ise `VITE_SUPABASE_ANON_KEY` kullanımı (backward compatible).

| Önce | Sonra |
|------|--------|
| `export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;` | `export const supabaseAnonKey =`<br>`  import.meta.env.VITE_SUPABASE_KEY \|\| import.meta.env.VITE_SUPABASE_ANON_KEY;` |

Başka dosya değiştirilmedi.

---

## 3) Doğrulama Komutları ve Sonuç

| Adım | Komut / eylem | Sonuç |
|------|----------------|--------|
| Dev server | `pnpm --filter @ogrency/panel dev` | Vite v7.3.1 ready (port 5174; 5173 kullanımda olduğu için). |
| HTTP GET / | `Invoke-WebRequest http://localhost:5174/ -UseBasicParsing` | StatusCode 200, ContentLength 1021. |
| HTTP GET entry | `Invoke-WebRequest http://localhost:5174/src/main.jsx -UseBasicParsing` | StatusCode 200. |

**Manuel doğrulama notu:** “supabaseKey is required” hatasının kalktığı tarayıcıda kontrol edilmeli. Executor’ın tarayıcı erişimi yok; bu nedenle sadece dev server’ın ayağa kalkması ve HTTP yanıtlarının 200 dönmesi doğrulandı. Tarayıcıda http://localhost:5173/ (veya Vite’ın raporladığı port) açılıp Console’da bu hata olmadığı manuel teyit edilmelidir.

---

## 4) Kalan Riskler (varsa)

- **İki anahtar da yoksa:** Davranış değişmedi; `createClient(..., undefined, ...)` çağrılır, @supabase/supabase-js yine “supabaseKey is required” fırlatır.
- **Sadece .env.example kullanılıyorsa:** Örnekte `VITE_SUPABASE_ANON_KEY` boş; yine crash olur (gerçek değer .env.local vb. ile sağlanmalı).
- Başka risk notu yok.
