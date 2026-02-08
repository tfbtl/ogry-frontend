# FE-CLEANUP-AUDIT-0001 — Repoda Gereksiz Dosya/Kod Denetimi (READ-ONLY)

**document_code:** FE-CLEANUP-AUDIT-0001  
**version:** 1.0.0  
**status:** required  
**authority:** CTO + Tech Lead  
**executor:** Implementer AI (Cursor)  
**scope:** ogry-frontend (repo root) + apps/* + packages/* + tools/*  
**risk:** none (read-only)  
**intent:** Repo içindeki gereksiz ayar dosyaları, artık kullanılmayan kodlar, çakışan config'ler ve “temizlik adayı” varlıkları tespit edip raporlamak.

---

## 0) Özet

**Temizlik adayı var mı?** Evet.  
**Toplam aday sayısı (yaklaşık):** ~12–15 madde (config, dead code, dependency, tooling, docs).  
**En riskli 3 konu:** (1) Workspace’te referans edilmeyen `@ogrency/eslint-config` ve `@ogrency/tsconfig` paketleri — ileride kullanım planı yoksa gereksiz paket kalabalığı ve turbo scope’ta yer almaları; (2) Panel ESLint’te taşınan `src/pages` path’ine göre güncel olmayan kural (stale pattern) — kural hiçbir dosyaya uygulanmıyor; (3) Website’te hiç import edilmeyen `Counter.js` bileşeni (ölü kod) — silinirse risk düşük ama kanıtlanmış tespit.

---

## 1) GEREKSİZ / ÇAKIŞAN AYAR DOSYALARI (Config Debt)

| # | Dosya yolu | Neden gereksiz/çakışıyor? | Kaldırılırsa risk | Kanıt (referans) |
|---|------------|---------------------------|-------------------|-------------------|
| 1 | `apps/panel/eslint.config.js` — `files` içinde `"src/pages/**/*.{js,jsx}"` | `pages` FE-STRUCTURE-ALIGN-0001 ile `src/features/pages` altına taşındı; `src/pages` artık yok. Bu pattern hiçbir dosyayla eşleşmiyor (stale). | LOW — Kural sadece uygulanmıyor; kaldırılırsa davranış değişmez. | `grep -r "src/pages" apps/panel` → sadece eslint.config.js; dizin yok. |
| 2 | `apps/website/eslint.config.mjs` — `files` içinde `"app/(routes)/**/*.{js,jsx}"` | `app` altında `(routes)` route group’u yok; about, account, api, cabins, login, lib, server vb. var. Pattern eşleşen dosya üretmiyor. | LOW — Aynı şekilde kural etkisiz. | `ls apps/website/app` → `(routes)` yok. |
| 3 | `packages/eslint-config` (tüm paket) | Paket workspace’te tanımlı; hiçbir `package.json` veya `eslint.config.*` bu paketi extend etmiyor. Panel ve website kendi flat config’lerini kullanıyor. | LOW — Silinirse sadece workspace’ten çıkar; mevcut lint davranışı değişmez. | `grep -r "@ogrency/eslint-config"` → sadece FE-GATE-0004.md (doküman listesi). |
| 4 | `packages/tsconfig` (tüm paket) | Paket workspace’te tanımlı; hiçbir `tsconfig.json` `extends` ile bu pakete referans vermiyor. Her app/package kendi tsconfig’ini kullanıyor. | LOW — Kullanılmıyor; kaldırılırsa build/lint etkilenmez. | `grep -r "@ogrency/tsconfig\|extends.*tsconfig"` → sadece FE-GATE-0004.md ve paket kendi package.json. |
| 5 | `.github/` | Repo kökünde `.github` dizini yok. CI/workflow konfigürasyonu repoda bulunmuyor (branch protection vb. harici yapılandırma). | N/A — Eksiklik; “gereksiz config” değil, “CI config repoda yok” notu. | `list_dir .github` → Path does not exist. |

**Çakışan çift config yok:** ESLint iki farklı uygulama için ayrı (panel .js, website .mjs); Prettier/EditorConfig kök için tek dosya bulunmadı (0 .prettier*). Tsconfig’ler uygulama/paket bazlı, zincir tek.

---

## 2) GEREKSİZ KOD / ÖLÜ KOD (Dead Code)

| # | Dosya yolu | Neden dead? | Silinirse risk + doğrulama |
|---|------------|------------|----------------------------|
| 1 | `apps/website/app/lib/components/Counter.js` | Export edilen varsayılan bileşen hiçbir yerde import edilmiyor. `Cabin.js`, `TextExpander`, vb. import ediliyor; `Counter` için repo çapında import yok. | LOW — Silinirse build bozulmaz. Doğrulama: `pnpm -w run build` (website), `grep -r "Counter" apps/website` import yok. |
| 2 | (Legacy klasör) | `backendAdapter` ve `supabaseAdapter` ikisi de kullanımda; `cabinAdapterFactory` her iki adapter’ı import ediyor (feature flag ile seçim). Legacy klasör kalıntısı tespit edilmedi. | — |

**Not:** AST ile tam “export edilip hiç import edilmeyen” taraması yapılmadı; yukarıdaki pratik grep/usage ile kanıtlı. `Counter.js` tek net ölü bileşen.

---

## 3) BAĞIMLILIK ŞİŞKİNLİĞİ (Dependency Hygiene)

En olası adaylar (max 10):

| # | Paket | Nerede | Neden şüpheli | Doğrulama |
|---|--------|--------|----------------|-----------|
| 1 | `@ogrency/eslint-config` | pnpm-workspace (packages/*) | Hiçbir proje dependency olarak eklemiyor; turbo “packages in scope” listesinde geçiyor. | `pnpm why @ogrency/eslint-config` (root’ta yok). |
| 2 | `@ogrency/tsconfig` | pnpm-workspace (packages/*) | Aynı şekilde hiçbir tsconfig veya package.json referansı yok. | `pnpm why @ogrency/tsconfig` (root’ta yok). |
| 3 | `react` | panel ^19.2.0, website 19.2.3 | Farklı sabit/range; tek major’da iki versiyon. Duplicate değil ama versiyon dağınıklığı. | `pnpm list react -r` |
| 4 | `@tanstack/react-query-devtools` | apps/panel | Sadece panel’de; dev araç. Production build’e girmemesi için tree-shake / dev-only kullanım kontrolü. | Build çıktısında devtools içeriği var mı kontrol. |
| 5 | `server-only` | apps/website | Doğru sınıflandırma (dependency); kullanım: server modüllerinde. Şüphe düşük. | `grep -r "server-only" apps/website` |
| 6 | `babel-plugin-react-compiler` | apps/website devDependencies | Next 16 ile reactCompiler: true kullanılıyor; babel plugin ayrıca gerekli mi belirsiz. | Next docs: React Compiler config. |
| 7 | `date-fns` | panel + website ^4.1.0 | Her iki app’te aynı major; duplicate versiyon yok. | — |
| 8 | `@supabase/supabase-js` | website (dependency) + packages/providers/supabase-public | Website doğrudan da listeliyor; FE-GATE-0004 kurallarına göre public flow’da doğrudan import yasak, wrapper kullanılıyor olmalı. Versiyon: website ^2.90.1, supabase-public ^2.93.3 — iki farklı sürüm. | `pnpm why @supabase/supabase-js`; gate’in “direct import” kuralı. |
| 9 | `axios` | packages/http | Sadece http paketinde; panel/website HttpClient üzerinden kullanıyor. Kullanılmayan değil. | — |
| 10 | Root `turbo` | devDependencies ^2.3.0 | Tek; çakışma yok. | — |

**Özet:** En net adaylar: (1) ve (2) kullanılmayan workspace paketleri; (3) react versiyon dağınıklığı; (8) @supabase/supabase-js iki yerde farklı sürüm.

---

## 4) TOOLING / GATE KALINTISI

| # | Öğe | Kullanılıyor mu? | Kanıt |
|---|-----|------------------|--------|
| 1 | `tools/gates/validate-env-and-imports.mjs` | Evet | Root package.json: `"validate:env-imports": "node tools/gates/validate-env-and-imports.mjs"`. |
| 2 | `tools/gates/validate-folder-structure.mjs` | Evet | Root package.json: `"validate:folder-structure": "node tools/gates/validate-folder-structure.mjs"`. |
| 3 | Root script `validate:boundaries` | Evet | `"validate:boundaries": "turbo run validate:boundaries"`; turbo.json’da task tanımlı; panel ve website’te `scripts/validate-boundaries.js` var ve script ismi eşleşiyor. |
| 4 | `apps/panel/scripts/mock-backend.cjs` | Dokümanda referans | VERIFICATION_STEPS.md içinde kullanım talimatı; CI’da çağrılmıyor. Boşa düşen değil, manuel test/verification script. |
| 5 | `apps/website/scripts/mock-backend.cjs` | Aynı | Aynı. |
| 6 | `apps/website` script `prod2` | Şüpheli | `"prod2": "next build && npx serve@latest out"` — Next default output `.next`; `out` genelde `output: 'export'` ile olur. next.config.mjs’te `output: "export"` yorum satırı. Script “out” kullanıyor, mevcut config’te static export kapalı. | Script çalıştırılırsa “out” boş/eksik olabilir. |
| 7 | docs/fe/notes — superseded doküman | Opsiyonel | FE-PUSH-VERIFICATION-497dd7a.md (archive/FE-PUSH-VERIFICATION-497dd7a.md) tek seferlik push doğrulama raporu (commit hash’li); güncel governance SSOT değil. FE-HANDOVER-0001, FE-GATE-0005 vb. aktif referans alan dokümanlar. | Arşivlenebilir; “superseded” olarak işaretlenebilir. |

**Sonuç:** Gate script’leri ve validate:boundaries kullanımda. Boşa düşen script: website `prod2` (hedef dizin `out` mevcut config ile üretilmiyor). Doküman: FE-PUSH-VERIFICATION-497dd7a arşivlendi (docs/fe/notes/archive/FE-PUSH-VERIFICATION-497dd7a.md).

---

## 5) “HIZLI KAZANIM” TEMİZLİK LİSTESİ (Quick Wins)

1. **LOW —** Panel ESLint `files` içinden `src/pages/**` kaldır veya `src/features/pages/**` yap (tek satır).
2. **LOW —** Website ESLint `files` içinden `app/(routes)/**` kaldır veya gerçek route group path’i ile değiştir.
3. **LOW —** `apps/website/app/lib/components/Counter.js` kaldır (hiç import yok); build + lint ile doğrula.
4. **LOW —** docs/fe/notes: FE-PUSH-VERIFICATION-497dd7a.md’yi “archive” alt dizinine taşı veya başına [ARCHIVE] ekle.
5. **MED —** `packages/eslint-config`: Eğer ortak config planlanmıyorsa workspace’ten çıkar (ve turbo’dan); FE-GATE-0004.md “packages in scope” listesini güncelle.
6. **MED —** `packages/tsconfig`: Aynı şekilde kullanılmayacaksa kaldır; scope listesini güncelle.
7. **MED —** Website `prod2` script’ini kaldır veya next.config’te `output: 'export'` açıp `out` kullanımını dokümante et.
8. **MED —** React versiyonlarını panel/website’te aynı minor’a hizala (örn. 19.2.x); tek PR.
9. **HIGH —** @supabase/supabase-js’i iki yerde farklı sürüm tutmak: Şimdilik dokunma; website ve supabase-public’te farklı major/minor olabilir, test ve gate ile doğrulanmalı.
10. **HIGH —** .github/workflows eklemek: Bu “temizlik” değil, eksiklik; ayrı governance/CI task’ı. Şimdilik dokunma.

---

## 6) ÖNERİLEN TEMİZLİK PLANI (2 PR Stratejisi)

### PR-1: docs-only / config-only (LOW risk)

- **Hedef:** Stale ESLint pattern’leri, opsiyonel doc arşivi, (isteğe bağlı) prod2 kaldırma veya dokümantasyon.
- **Yapılacaklar:**  
  - apps/panel/eslint.config.js → `src/pages/**` kaldır veya `src/features/pages/**` yap.  
  - apps/website/eslint.config.mjs → `app/(routes)/**` kaldır veya doğru path.  
  - FE-PUSH-VERIFICATION-497dd7a.md → docs/fe/notes/archive/ altına taşındı (FE-CLEANUP-IMPLEMENT-0001).  
  - (Opsiyonel) apps/website/package.json → `prod2` script’i kaldır veya yorum + README’de açıklama.
- **Doğrulama:**  
  `pnpm -w run validate:env-imports`  
  `pnpm -w run validate:folder-structure`  
  `pnpm -w run lint`  
  `pnpm -w run build`

### PR-2: code cleanup (MED risk)

- **Hedef:** Ölü kod kaldırma, kullanılmayan workspace paketleri çıkarma.
- **Yapılacaklar:**  
  - apps/website/app/lib/components/Counter.js sil.  
  - (Eğer karar verilirse) packages/eslint-config ve packages/tsconfig’i workspace’ten çıkar; pnpm-workspace.yaml ve turbo scope’u güncelle; FE-GATE-0004.md “packages in scope” güncelle.  
  - React versiyon hizalaması (tek minor).
- **Doğrulama:**  
  `pnpm -w run validate:env-imports`  
  `pnpm -w run validate:folder-structure`  
  `pnpm -w run lint`  
  `pnpm -w run build`  
  (Paket kaldırılıyorsa: `pnpm install` ve tüm app’lerin build’i.)

---

## DOĞRULAMA (Çalıştırılan komutlar)

Rapor hazırlanırken aşağıdaki komutlar çalıştırıldı; hepsi **PASS**:

| Komut | Sonuç |
|--------|--------|
| `pnpm -w run validate:env-imports` | PASS — 267 dosya tarandı, ihlal yok. |
| `pnpm -w run validate:folder-structure` | PASS — Blueprint v2.4.0 ile uyumlu. |
| `pnpm -w run lint` | PASS — turbo run lint (panel + website) başarılı. |
| `pnpm -w run build` | PASS — panel (vite) + website (next) build başarılı. |

Ortam: Repo kökünde (ogry-frontend), Windows, pnpm; ağ veya sandbox kısıtı yok.

---

## ÇIKIŞ

- **docs/fe/notes/FE-CLEANUP-AUDIT-0001.md** oluşturuldu.  
- Kod/config değişikliği **yapılmadı**; sadece tespit + rapor + plan.  
- Commit & push talep edilmedi (read-only).
