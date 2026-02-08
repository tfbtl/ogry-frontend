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

**Durum (FE-STRUCTURE-ALIGN-0001 sonrası):** Tüm ihlaller giderildi. `pnpm -w run validate:folder-structure` **PASS** (0 ihlal). Allowlist genişletilmedi; taşıma/refactor ile uyum sağlandı.

*(Aşağıdaki tablolar geçmiş referans içindir; refactor önerileri FE-STRUCTURE-ALIGN-0001 ile uygulandı.)*

### Website — apps/website/app/ (giderildi)

| Klasör | Sebep | Yapılan |
|--------|--------|--------|
| _components | "_" ile başlıyor | `app/lib/components` altına taşındı. |
| _styles | "_" ile başlıyor | İçerik `app/globals.css` ile birleştirildi; klasör kaldırıldı. |

### Panel — apps/panel/src/ (giderildi)

| Klasör | Sebep | Yapılan |
|--------|--------|--------|
| context | Allowlist dışı | `lib/context` altına taşındı. |
| data | Allowlist dışı | `lib/data` altına taşındı. |
| hooks | Allowlist dışı | `lib/hooks` altına taşındı. |
| pages | Allowlist dışı | `features/pages` altına taşındı. |
| services | Allowlist dışı | `lib/services` altına taşındı. |
| shared | Allowlist dışı | `lib/shared` altına taşındı. |
| utils | Allowlist dışı | `lib/utils` altına taşındı. |



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

## Doğrulama (FE-STRUCTURE-ALIGN-0001 sonrası)

- **validate:folder-structure:** **PASS** (0 ihlal).
- **validate:env-imports:** PASS.
- **lint:** PASS.
- **build:** PASS (panel + website).
