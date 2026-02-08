# FE-PANEL-ENV-PROOF-0001 — Supabase Env Load Verification (No Code Changes)

**document_code:** FE-PANEL-ENV-PROOF-0001  
**version:** 1.0.0  
**status:** required  
**authority:** CTO  
**executor:** Implementer AI (Cursor)  
**scope:** apps/panel (READ + RUN-ONLY)  
**risk:** low (no code changes)  
**intent:** Panel'deki "supabaseKey is required" crash'inin env yükleme nedeniyle olduğunu kod değiştirmeden kanıtlamak: hangi env bekleniyor, hangi .env dosyaları var, Vite bu env'leri nasıl okuyor?

---

## 1) Amaç & Kapsam

- **Amaç:** "supabaseKey is required" crash'inin env yükleme ile ilişkisini kanıtlamak; beklenen env isimleri, mevcut .env dosyaları, Vite okuma yöntemi ve runtime crash kaynağını raporlamak. Kod veya .env değişikliği yok.
- **Kapsam:** apps/panel; READ + RUN-ONLY. Env değerleri (secret) rapora yazılmadı.

---

## 2) Beklenen Env Anahtarları (isim listesi)

**Kaynak:** `apps/panel/src/composition/config.ts`

| Beklenen env anahtarı | Kullanım |
|------------------------|----------|
| VITE_SUPABASE_URL | supabaseUrl |
| VITE_SUPABASE_KEY | supabaseAnonKey |
| VITE_API_URL | apiUrl |
| VITE_USE_BACKEND_CABINS | featureFlags.useBackendCabins |

Liste sadece isim; değer yok.

---

## 3) Mevcut .env* Dosyaları (konum + dosya adı)

| Konum | Dosya adı |
|--------|-----------|
| apps/panel | .env.example |
| apps/panel | .env.local |
| apps/website | .env.example |
| apps/website | .env.local |

Repo root'ta .env* dosyası yok. Panel kapsamında ilgili olanlar: `apps/panel/.env.example`, `apps/panel/.env.local`.

---

## 4) .env İçindeki Anahtar İsimleri (değerler ***)

**apps/panel/.env.example (tanımlı anahtar isimleri):**
- VITE_SUPABASE_URL=***
- VITE_SUPABASE_ANON_KEY=***

**apps/panel/.env.local (tanımlı anahtar isimleri):**
- VITE_SUPABASE_URL=***
- VITE_SUPABASE_ANON_KEY=***

Değerler rapora yazılmadı; yalnızca anahtar isimleri listelendi.

**Tespit:** Config dosyası `VITE_SUPABASE_KEY` okuyor; .env dosyalarında tanımlı olan isim `VITE_SUPABASE_ANON_KEY`. İsim uyuşmuyor; bu nedenle `import.meta.env.VITE_SUPABASE_KEY` panel tarafında undefined kalır.

---

## 5) Vite Env Okuma Yöntemi (import.meta.env vs process.env)

**Kaynak:** `apps/panel/src/composition/config.ts`

| Yöntem | Kullanım |
|--------|----------|
| import.meta.env | Tüm env okumaları burada: VITE_SUPABASE_URL, VITE_SUPABASE_KEY, VITE_API_URL, VITE_USE_BACKEND_CABINS. |

process.env kullanılmıyor. Vite'da sadece `VITE_` öneki taşıyan değişkenler istemciye açılır; değişken adı bire bir eşleşmelidir.

---

## 6) Runtime Crash Kanıtı (stack snippet)

**Hata mesajı:** `supabaseKey is required.`

**Kaynak (kanıt):** `@supabase/supabase-js` paketi — `SupabaseClient` constructor. Panel tarafında Vite pre-bundle: `apps/panel/node_modules/.vite/deps/@supabase_supabase-js.js`.

**İlgili satırlar (constructor, ~11188–11193):**
```text
  constructor(supabaseUrl, supabaseKey, options) {
    ...
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    const baseUrl = validateSupabaseUrl(supabaseUrl);
    if (!supabaseKey) throw new Error("supabaseKey is required.");
```

**Akış:**  
`composition/config.ts` → `supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY` (undefined, çünkü .env'de anahtar adı `VITE_SUPABASE_ANON_KEY`).  
`composition/supabasePublicClient.ts` → `createSupabasePublicClient({ url: supabaseUrl, anonKey: supabaseAnonKey, ... })` → `createClient(config.url, config.anonKey, ...)`.  
anonKey undefined olduğu için `SupabaseClient` constructor'da `if (!supabaseKey)` sağlanır ve `throw new Error("supabaseKey is required.")` fırlatılır.

Tarayıcı konsolu stack'i executor ortamında toplanmadı; kaynak kodu ve bundle incelemesi ile yukarıdaki satır kanıt olarak raporlandı.

---

## 7) Vite Mode

Vite dev komutu (`pnpm --filter @ogrency/panel dev` → `vite`) varsayılan olarak **development** mode ile çalışır. `apps/panel/vite.config.js` içinde mode override yok.

---

## 8) Sonuç (kanıta dayalı)

- Panel config'i **VITE_SUPABASE_KEY** bekliyor; .env.example ve .env.local'da tanımlı olan isim **VITE_SUPABASE_ANON_KEY**. İsim farkı nedeniyle `import.meta.env.VITE_SUPABASE_KEY` undefined.
- `createSupabasePublicClient` bu undefined değeri anonKey olarak `@supabase/supabase-js` `createClient`'a veriyor; constructor içinde `if (!supabaseKey) throw new Error("supabaseKey is required.")` tetikleniyor.
- Bu nedenle "supabaseKey is required" crash'i, env anahtar adı uyuşmazlığına (beklenen: VITE_SUPABASE_KEY, mevcut: VITE_SUPABASE_ANON_KEY) bağlı env yükleme problemi ile tutarlıdır.

Çözüm veya aksiyon önerisi verilmedi; yalnızca kanıt raporlandı.
