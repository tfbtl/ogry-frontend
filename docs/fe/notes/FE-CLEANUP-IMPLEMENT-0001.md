# FE-CLEANUP-IMPLEMENT-0001 — LOW RISK / HIGH VALUE Temizlik (EXECUTE)

**document_code:** FE-CLEANUP-IMPLEMENT-0001  
**version:** 1.1.0  
**status:** required  
**authority:** CTO + Architect + Tech Lead  
**executor:** Implementer AI (Cursor)  
**scope:** apps/website + apps/panel + docs/fe/notes  
**risk:** low (hijyen, davranış değişikliği yok)  
**intent:** FE-CLEANUP-AUDIT-0001 raporundaki SADECE “LOW RISK” maddeleri uygulayıp repo hijyenini artırmak.

**Girdi (SSOT):** docs/fe/notes/FE-CLEANUP-AUDIT-0001.md

---

## Yapılanlar (3 madde)

| # | Görev | Sonuç | Gerekçe |
|---|--------|--------|--------|
| 1 | Ölü kod: Counter bileşeni | **Success** | Repo içinde “Counter” import eden dosya yok (sadece Counter.js kendi içinde); dosya silindi. |
| 2 | ESLint stale path temizliği | **Success** | Panel: `src/pages/**` kaldırıldı. Website: `app/(routes)/**` kaldırıldı. Yalnızca hayalet path’ler temizlendi. |
| 3 | Doküman arşivleme | **Success** | `docs/fe/notes/archive/` oluşturuldu. FE-PUSH-VERIFICATION-497dd7a.md arşive taşındı (dosya untracked olduğu için copy + delete; git mv kaynak version control’de değildi). FE-CLEANUP-AUDIT-0001.md içinde referanslar yeni konuma güncellendi. |

---

## Silinen dosya

- **apps/website/app/lib/components/Counter.js**

---

## Güncellenen ESLint dosyaları ve kaldırılan stale path’ler

| Dosya | Kaldırılan / değişen |
|--------|------------------------|
| apps/panel/eslint.config.js | `files` dizininden `"src/pages/**/*.{js,jsx}"` kaldırıldı. Kalan: `["src/ui/**/*.{js,jsx}", "src/features/**/*.{js,jsx}"]`. |
| apps/website/eslint.config.mjs | `files` dizininden `"app/(routes)/**/*.{js,jsx}"` kaldırıldı. Kalan: `["app/lib/components/**/*.{js,jsx}"]`. |

Yeni kural eklenmedi; sadece var olmayan path referansları temizlendi.

---

## Arşive taşınan doküman ve güncellenen referanslar

- **Taşınan:** docs/fe/notes/FE-PUSH-VERIFICATION-497dd7a.md → **docs/fe/notes/archive/FE-PUSH-VERIFICATION-497dd7a.md**
- **Güncellenen referanslar:** docs/fe/notes/FE-CLEANUP-AUDIT-0001.md içinde:
  - Tooling tablosunda doküman adı “archive/FE-PUSH-VERIFICATION-497dd7a.md” ve “arşivlendi” notu ile güncellendi.
  - Sonuç satırında yeni konum yazıldı.
  - PR-1 planında “taşındı (FE-CLEANUP-IMPLEMENT-0001)” notu eklendi.

---

## Verification sonuçları

| Komut | Sonuç |
|--------|--------|
| pnpm -w run validate:env-imports | **PASS** (266 dosya tarandı, ihlal yok) |
| pnpm -w run validate:folder-structure | **PASS** (Blueprint v2.4.0 uyumlu) |
| pnpm -w run lint | **PASS** (panel + website) |
| pnpm -w run build | **PASS** (panel + website) |

---

## Not

- Paket versiyonlarına ve packages/* config’lerine dokunulmadı.
- UI/route/auth davranışı değiştirilmedi.
- Counter hiçbir yerde import edilmediği için silme uygulandı.
