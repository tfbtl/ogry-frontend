# FE-CONFIG-SSOT-0001 — Env & Config Management Standard

**document_code:** FE-CONFIG-SSOT-0001  
**version:** 1.0.0  
**status:** required  
**authority:** CTO  
**scope:** Panel + Website + gelecekte Mobile  
**risk:** none (docs only)

---

## 1) Amaç

- Panel, Website ve (gelecekte) Mobile için **tek bir config yönetim standardı** tanımlamak.
- **Canonical key listesi** (SSOT): Hangi config anahtarlarının var olduğu ve anlamları.
- **Platform prefix mapping**: Hangi platformda hangi env değişken adının kullanıldığı.
- **Server-only vs client-safe** ayrımı: Secret’ların sadece server’da okunması; client’a sadece güvenli (public) değişkenlerin açılması.
- **Composition-root env okuma kuralı**: Env okuma yalnızca composition root dosyalarında; UI/route kodunda doğrudan env okunmaz.

---

## 2) Non-Goals

- Mevcut kodu bu standarda zorla uydurmak (kademeli geçiş).
- Yeni platform (Mobile) için somut implementasyon; sadece mapping ve kurallar yazılır.
- Secret değerlerinin dokümante edilmesi veya örneklenmesi.
- Build-time vs runtime config stratejisi detayı (sadece “composition root’ta oku” kuralı).

---

## 3) Canonical Config Keys (SSOT)

Aşağıdaki anahtarlar **canonical** (tek kaynak) isimlerdir. Platforma özgü env değişken adları bunlara map edilir.

| Canonical key | Açıklama | Tip |
|---------------|----------|-----|
| supabaseUrl | Supabase project URL | string |
| supabaseAnonKey | Supabase anon/public key (client-safe) | string |
| apiUrl | Backend API base URL | string |
| featureFlags.useBackendCabins | Cabins için backend API kullan (true/false) | boolean |

Tüm client-safe config bu dört alan (ve ileride eklenen canonical alanlar) üzerinden türetilir.

---

## 4) Platform Mappings (Panel/Vite, Website/Next Client, Website/Next Server, Mobile/RN)

| Canonical | Panel (Vite) | Website Next Client | Website Next Server | Mobile (RN) |
|-----------|--------------|---------------------|--------------------|------------|
| supabaseUrl | VITE_SUPABASE_URL | NEXT_PUBLIC_SUPABASE_URL | (server-only ayrı) | (TBD) |
| supabaseAnonKey | VITE_SUPABASE_ANON_KEY (veya VITE_SUPABASE_KEY compat) | NEXT_PUBLIC_SUPABASE_ANON_KEY | (server-only ayrı) | (TBD) |
| apiUrl | VITE_API_URL | NEXT_PUBLIC_API_URL | (server-only ayrı) | (TBD) |
| featureFlags.useBackendCabins | VITE_USE_BACKEND_CABINS | NEXT_PUBLIC_USE_BACKEND_CABINS | (TBD) | (TBD) |

- **Panel/Vite:** `import.meta.env.VITE_*`; sadece `VITE_` prefix’li değişkenler client’a açılır.
- **Website Next Client:** `process.env.NEXT_PUBLIC_*`; sadece `NEXT_PUBLIC_` prefix’li değişkenler client bundle’a gömülür.
- **Website Next Server:** Server-only secret’lar (örn. service role key) `process.env.*` ile sadece server kodunda (örn. app/server/**) okunur; bu dokümanda sadece “server-only ayrı” kuralı vardır.
- **Mobile/RN:** İleride tanımlanacak; env/key mapping aynı canonical isimlere map edilecek.

---

## 5) Security Rules (server-only, client-safe)

- **Client-safe:** Tarayıcıda veya mobil client’ta görülebilir. Sadece **public** bilgiler: Supabase URL, anon key, backend API URL, feature flag’ler. Bu değişkenler **NEXT_PUBLIC_*** veya **VITE_*** ile prefix’lenir.
- **Server-only:** Asla client bundle’a veya client runtime’a gitmemeli. Supabase service role key, API secret’ları, DB URL vb. Sadece server context’inde (Next.js server components, API routes, Node runtime) okunur. Bu dokümanda değer veya key ismi örneklenmez; “server-only ayrı” denir.
- **Kural:** Client-safe config dosyası (composition root) sadece public env’i okur; server-only dosyalar (örn. app/server/**) ayrı tutulur ve karıştırılmaz.

---

## 6) Composition Root Rule (env read only in composition)

- **Kural:** Tüm env okuma (import.meta.env, process.env) **yalnızca composition root** dosyalarında yapılır.
- **Panel:** `apps/panel/src/composition/config.ts` — tek dosya; UI/feature kodları bu dosyadan import eder, doğrudan env okumaz.
- **Website client:** `apps/website/app/composition/config.ts` — public env; UI/client kodları buradan import eder.
- **Website server:** Server-only config (örn. app/server/supabase.js) ayrı; composition root kuralı “client config” için geçerli, server tarafı kendi boundary’sinde kalır.
- **Sonuç:** UI bileşenleri, use case’ler, adapter’lar env’e doğrudan erişmez; sadece composition root’tan gelen değerleri kullanır.

---

## 7) Backward Compatibility Policy (kademeli kaldırma)

- Yeni env isimleri eklenirken **eski isimler kademeli kaldırılır**. Örnek: Panel’de hem `VITE_SUPABASE_KEY` hem `VITE_SUPABASE_ANON_KEY` kabul edilebilir; önce yeni isim tercih edilir, eski isim fallback olarak okunur.
- Eski ismin kaldırılması ayrı bir görevle (migration/cleanup) yapılır; bu doküman sadece “backward compat kabul edilir” politikasını yazar.
- **Örnek:** normalize fonksiyonunda `VITE_SUPABASE_ANON_KEY || VITE_SUPABASE_KEY` gibi sıra ile her iki key de desteklenebilir.

---

## 8) Examples (değer yazmadan, sadece key isimleri)

**Panel (.env / .env.local) key isimleri:**
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY (veya backward compat: VITE_SUPABASE_KEY)
- VITE_API_URL
- VITE_USE_BACKEND_CABINS

**Website client (.env / .env.local) key isimleri:**
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_USE_BACKEND_CABINS

**Website server:** Bu dokümanda key isimleri örneklenmez (server-only; ayrı güvenlik dokümanına bırakılır).

Değer örnekleri verilmez; sadece key isimleri SSOT ve platform mapping ile uyumludur.
