# FE-STRUCTURE-ALIGN-0001 — Gate'i Yeşile Çevir (FE-GATE-0005 Uyum)

**document_code:** FE-STRUCTURE-ALIGN-0001  
**version:** 1.1.0  
**status:** required  
**authority:** CTO + Architect + Tech Lead  
**executor:** Implementer AI (Cursor)  
**scope:** apps/panel + apps/website + docs/fe/notes  
**risk:** medium (path refactor)  
**intent:** FE-GATE-0005'in yakaladığı "rogue root folders" ihlallerini, allowlist genişletmeden gider ve validate:folder-structure PASS yap.

---

## Sonuç

- **validate:folder-structure:** PASS (0 ihlal)  
- **validate:env-imports:** PASS  
- **lint:** PASS  
- **build:** PASS (panel + website)

Allowlist genişletilmedi; yeni root klasör türetilmedi. Sadece path/organizasyon değişiklikleri yapıldı.

---

## Taşınan klasörler (gerçek isimlerle)

### Panel — apps/panel/src/

| Eski (root) | Yeni |
|-------------|------|
| context     | lib/context |
| data        | lib/data |
| hooks       | lib/hooks |
| services    | lib/services |
| shared      | lib/shared |
| utils       | lib/utils |
| pages       | features/pages |

*Taşımalar `git mv` ile yapıldı (services için izin hatası nedeniyle copy + delete kullanıldı).*

### Website — apps/website/app/

| Eski (root) | Yeni / Yapılan |
|-------------|----------------|
| _styles     | İçerik `app/globals.css` ile birleştirildi; klasör kaldırıldı. |
| _components | lib/components |

*_components `lib/components` altına taşındı; _styles global CSS olduğu için layout ile kullanılan tek dosyaya (globals.css) taşındı.*

---

## Güncellenen import sayısı (yaklaşık)

- **Panel:** ~50+ import güncellendi (context, data, hooks, services, shared, utils, pages → lib/* veya features/pages; ui, features, composition referansları düzeltildi).
- **Website:** ~25+ import güncellendi (_components → lib/components, _styles → globals.css; lib/components içinden actions/data-service/server yolları ../actions, ../data-service, ../../server olarak düzeltildi).

---

## Global CSS taşıması

- **Hangi dosyalar:** `app/_styles/globals.css` içeriği → `app/globals.css` (yeni root seviye dosya).
- **Neden:** _styles root’ta "_" ile başladığı için FE-GATE-0005 ihlaliydi; global CSS layout tarafından tek yerden import edildiği için klasör kaldırılıp tek `globals.css` kullanıldı.
- **Davranış:** UI davranışı değiştirilmedi; sadece import path `layout.js` içinde `./globals.css` olarak güncellendi.

---

## Verification (çalıştırılan komutlar)

1. `pnpm -w run validate:folder-structure` → **PASS**  
2. `pnpm -w run validate:env-imports` → **PASS**  
3. `pnpm -w run lint` → **PASS**  
4. `pnpm -w run build` → **PASS** (panel + website)

---

## Notlar

- FE-GATE-0004 (validate:env-imports): `lib/components` altındaki server component/action kullanımı için `isServerComponentOrAction` kapsamı `lib/components` içeren yolları da kapsayacak şekilde güncellendi (server boundary korundu).
- Website’te client kodun server modülü import etmediği doğrulandı; `lib/components` içinden `../../server/auth` kullanımı sadece server component/action dosyalarında.
