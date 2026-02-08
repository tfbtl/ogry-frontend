# FE-GATE-0005 — Folder Structure Enforcement Gate

**document_code:** FE-GATE-0005  
**version:** 1.2.0  
**status:** required  
**authority:** CTO + Architect + Tech Lead  
**scope:** tools/gates/validate-folder-structure.mjs, root package.json, docs

---

## Amaç

Blueprint v2.4.0 dışında frontend projelerinde kök seviye (1. seviye) klasör açılmasını CI seviyesinde engellemek. Bu gate:

- Import kontrolü **yapmaz** (validate-env-and-imports yapar).
- Kod refactor **etmez**.
- **Sadece** dizin varlığına bakar; dosyaları yoksayar.

Yanlış / tanımsız klasör = **CI FAIL**.

**SSOT:** docs/fe/frontend-blueprint-tree.md

---

## Website (Next.js App Router) — apps/website/app/

### İzin verilen “infrastructure” root klasörleri (allowlist)

- composition  
- server  
- lib  
- i18n  

### Route detection (allowlist dışı klasörler)

Allowlist’te **olmayan** bir 1. seviye klasör, aşağıdakilerden **en az biri** sağlanırsa **izinli** kabul edilir:

1. Klasör adı **"("** ile başlıyorsa → Route group → **İZİN VER**.
2. Klasör adı **"["** ile başlıyorsa → Dynamic segment → **İZİN VER**.
3. Klasörün kendisinde veya alt dizinlerinde (max derinlik 4) şu dosyalardan biri varsa → Route segment → **İZİN VER**:
   - page.tsx / page.jsx / page.ts / page.js  
   - layout.tsx / layout.jsx / layout.ts / layout.js  
   - route.ts / route.js  
   - loading.tsx / loading.jsx / loading.ts / loading.js  
   - not-found.tsx / not-found.jsx / not-found.ts / not-found.js  
   - error.tsx / error.jsx / error.ts / error.js  
   - template.tsx / template.jsx / template.ts / template.js  

### HARD FAIL (Website)

- **"_"** ile başlayan 1. seviye klasör → **FAIL**
- Allowlist dışı ve route detection’a girmeyen her klasör → **FAIL**
- Örnek yasak ad-hoc kök klasörler (route değilse): utils, services, hooks, components, types

---

## Panel (Vite) — apps/panel/src/

### İzin verilen 1. seviye klasörler (allowlist)

- composition  
- ui  
- lib  
- features  
- assets  
- styles  
- devtools  

**Route detection yok.** Allowlist dışı her 1. seviye klasör → **FAIL**.

### HARD FAIL (Panel)

- **"_"** ile başlayan her klasör → **FAIL**
- Allowlist dışı her klasör → **FAIL**

---

## Örnek FAIL senaryoları

| Konum | Klasör | Neden FAIL |
|--------|--------|------------|
| website/app | _components | "_" ile başlıyor |
| website/app | _styles | "_" ile başlıyor |
| website/app | utils | Allowlist’te yok, route değil |
| website/app | services | Allowlist’te yok, route değil |
| panel/src | context | Allowlist’te yok |
| panel/src | data | Allowlist’te yok |
| panel/src | hooks | Allowlist’te yok |
| panel/src | pages | Allowlist’te yok |
| panel/src | utils | Allowlist’te yok |

**Örnek geçerli:** website/app/about (içinde page.js var → route), website/app/(marketing) ("(" ile başlıyor → route group).

---

## Mevcut repoda tespit edilen ihlaller (gate çalıştırıldığında FAIL)

Allowlist **genişletilmedi**. Aşağıdaki klasörler gate’e göre ihlal; refactor önerisi ile raporlanıyor.

### Website — apps/website/app/

| Klasör | Sebep | Öneri |
|--------|--------|--------|
| _components | "_" ile başlıyor | Yeniden adlandır: `components` veya `app/lib/components` altına taşı. |
| _styles | "_" ile başlıyor | Yeniden adlandır: `styles` veya `app/lib/styles` / global stiller layout ile kalabilir. |

### Panel — apps/panel/src/

| Klasör | Sebep | Öneri |
|--------|--------|--------|
| context | Allowlist dışı | `lib/context` veya `features/.../context` altına taşı. |
| data | Allowlist dışı | `lib/data` veya `features` içinde ilgili yere taşı. |
| hooks | Allowlist dışı | `lib/hooks` altına taşı. |
| pages | Allowlist dışı | Router yapısına göre `features` içinde sayfa bileşenleri veya `lib` altında tutulabilir; Blueprint ile uyumlu tek isim: allowlist’teki klasörler. |
| services | Allowlist dışı | `lib/services` altına taşı. |
| shared | Allowlist dışı | `lib/shared` altına taşı. |
| utils | Allowlist dışı | `lib/utils` altına taşı. |

**Not:** Bu ihlaller giderilmeden `pnpm -w run validate:folder-structure` **PASS** etmez. Gate kirliliği meşrulaştırılmadı; taşıma / yeniden adlandırma yapılmalı.

---

## Çalıştırma

```bash
pnpm -w run validate:folder-structure
```

CI’da lint / build / validate:env-imports ile aynı seviyede koşturulmalı (GitHub Ruleset bu PR kapsamında güncellenmeyecek; sadece repo CI).

---

## Hata mesajı standardı

Gate FAIL’de örnek çıktı:

```
[FAIL] Invalid Folder: apps/website/app/utils
Reason: Root-level 'utils' is forbidden. Move it under 'app/lib/utils' or 'app/features/...'
Ref: docs/fe/frontend-blueprint-tree.md (Blueprint v2.4.0)
```

Exit code: **1**.

---

## Doğrulama (bu PR)

- **validate:folder-structure:** Mevcut repo ile **FAIL** (9 ihlal; doc’taki “Mevcut repoda tespit edilen ihlaller” giderilene kadar PASS olmaz).
- **lint:** PASS.
- **build:** PASS.
