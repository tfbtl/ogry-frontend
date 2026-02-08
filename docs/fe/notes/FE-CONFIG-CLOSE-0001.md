# FE-CONFIG-CLOSE-0001 — Config Layer Closure Notes

**document_code:** FE-CONFIG-CLOSE-0001  
**version:** 1.0.0  
**status:** required  
**authority:** CTO  
**scope:** docs only  
**risk:** none  
**intent:** FE config standardı ve packages/config değişikliğinin kapanış notu; canonical keys, adapter ilkesi, backward-compat penceresi ve mobile stratejisi tek yerde kilitlenir.

---

## 1) Amaç

Bu doküman, config katmanına dair alınan kararları ve mevcut gerçekliği “kapanış” olarak sabitlemek içindir. Yeni kod veya öneri yok; sadece neyin kilitlendiği ve operasyonel notlar yer alır.

---

## 2) Neyi Kilitledik? (SSOT + packages/config)

- **SSOT:** `docs/fe/standards/FE-CONFIG-SSOT-0001.md` — Env & Config Management Standard. Canonical key listesi, platform mapping, server-only vs client-safe, composition root kuralı ve backward compatibility policy burada tanımlı.
- **packages/config:** Paylaşılan schema (ClientConfig, FeatureFlags) ve normalize fonksiyonları (normalizeViteClientEnv, normalizeNextPublicEnv, normalizeNextServerEnv placeholder). Env okuma pakette yok; sadece composition root’ta yapılıyor, paket env objesini dışarıdan alıyor.
- **Panel:** `apps/panel/src/composition/config.ts` — import.meta.env, normalizeViteClientEnv ile tek noktadan export.
- **Website client:** `apps/website/app/composition/config.ts` — process.env (public), normalizeNextPublicEnv ile tek noktadan export. Server (app/server/**) bu kapanışın dışında; dokunulmadı.

---

## 3) Canonical Keys (liste)

| Canonical key | Tip | Açıklama |
|---------------|-----|----------|
| supabaseUrl | string | Supabase project URL. |
| supabaseAnonKey | string | Supabase anon/public key (client-safe). |
| apiUrl | string | Backend API base URL. |
| featureFlags.useBackendCabins | boolean | Cabins için backend API kullanımı (true/false). |

Yeni canonical key eklenmesi bu listeyi ve ilgili standardı güncellemeyi gerektirir.

---

## 4) Platform Adapter İlkesi (Vite / Next public / Next server / Mobile future)

- **Vite (Panel):** Env objesi import.meta.env; normalizeViteClientEnv ile canonical config üretilir. Prefix: VITE_*.
- **Next public (Website client):** Env objesi process.env; normalizeNextPublicEnv ile canonical config üretilir. Prefix: NEXT_PUBLIC_*.
- **Next server:** Client config katmanının dışında; server-only secret’lar app/server/** içinde okunur. packages/config’te normalizeNextServerEnv placeholder; gerçek secret okuma bu dokümanla eklenmedi.
- **Mobile (gelecek):** Strateji: Aynı canonical key listesi kullanılacak; platforma özgü env/key mapping ayrı bir adapter (veya normalize* fonksiyonu) ile tanımlanacak. SSOT’ta “TBD” olarak kilitlendi.

---

## 5) Backward Compatibility Window (VITE_SUPABASE_KEY fallback planı)

- **Mevcut durum:** normalizeViteClientEnv içinde supabaseAnonKey için önce VITE_SUPABASE_ANON_KEY, yoksa VITE_SUPABASE_KEY okunuyor. İkisi de yoksa boş string.
- **Kilitlenen karar:** VITE_SUPABASE_KEY fallback destekleniyor; kademeli kaldırma ayrı bir görevle yapılacak. Bu kapanış dokümanı fallback’in varlığını sabitler; kaldırma tarihi veya adımı burada tanımlı değil.

---

## 6) Operational Notes (website dev lock conflict notu)

- Website dev server (`pnpm --filter @ogrency/website dev`) aynı anda birden fazla instance çalıştırıldığında `.next/dev/lock` nedeniyle “Unable to acquire lock” hatası verebiliyor. Mevcut gerçeklik: Tek bir next dev instance’ı kapatılmadan yenisi başlatılamıyor; port 3000 (veya alternatif port) kullanımda olunca lock conflict oluşabiliyor. Bu davranış config katmanı kararı değil; operasyonel not olarak kilitlendi.

---

## 7) “Pencils Down” (bu katmana yeni ihtiyaç olursa nasıl açılır?)

- **Yeni canonical key:** SSOT dokümanı (FE-CONFIG-SSOT-0001) ve packages/config schema + ilgili normalize fonksiyonları güncellenir; değişiklik ayrı bir görev/PR ile yapılır.
- **Yeni platform (örn. Mobile):** SSOT’ta platform mapping ve adapter ilkesi güncellenir; packages/config’e yeni normalize* veya adapter eklenmesi CTO/görev onayı ile açılır.
- **Backward-compat kaldırma (örn. VITE_SUPABASE_KEY):** Ayrı migration/cleanup görevi; dokümanlarda ve kodda fallback kaldırılır.
- **Server config genişletme:** normalizeNextServerEnv veya app/server/** tarafı ayrı görevle; server boundary ihlali yapılmadan açılır.

Bu katman “pencils down” kabul edilir; yukarıdaki senaryolar dışında config katmanına ek değişiklik yapılmaz. İhtiyaç doğduğunda yeni doküman veya görev kodu ile açılır (ör. FE-CONFIG-*).
