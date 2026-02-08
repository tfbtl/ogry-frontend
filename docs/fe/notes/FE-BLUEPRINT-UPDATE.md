# FE-BLUEPRINT-UPDATE — Blueprint’i Next.js App Router (app/) ile Hizalama

**document_code:** FE-BLUEPRINT-UPDATE  
**status:** tamamlandı  
**scope:** docs only (kod ve gate değişikliği yok)

---

## Ne değişti? (Diff özeti)

### Dosya: docs/fe/frontend-blueprint-tree.md

| Bölüm | Değişiklik |
|--------|------------|
| **§2.3 apps/* overrides** | `apps/website/src/i18n/` → `apps/website/app/i18n/` (1 path düzeltmesi). |
| **§5.1 Website (Next.js)** | Başlık: "Website (Next.js)" → "Website (Next.js App Router)". Tüm website yapısı `src/` altından çıkarılıp tek kök `app/` altında toplandı. `app/` hem routing hem uygulama implementasyonu; `composition/`, `server/`, `lib/` artık açıkça `app/` altında. Server içeriği repoya göre `auth.js`, `supabase.js` olarak yazıldı. Rules’a “composition, server, lib live under app/ (underscoreless)” maddesi eklendi. |

**Satır etkisi:** §2.3’te 1 satır path değişti; §5.1’de ağaç yapısı ve kurallar yeniden yazıldı (~25 satır).

### GOVERNANCE.md ve CONTRIBUTING.md

- İkisinde de `apps/website/src/` veya benzeri spesifik path **yok**.
- Değişiklik yapılmadı.

---

## Yeni SSOT onayı

- **Website:** Next.js App Router ile %100 hizalı. Tüm infra klasörleri (`composition`, `server`, `lib`) ve i18n override path’i `apps/website/app/` altında tanımlı.
- **Panel:** Vite yapısı korundu; `apps/panel/src/` değişmedi.

---

## Doğrulama

- `apps/website/src/` blueprint içinde: **0 adet**.
- `apps/website/app/` doğru kullanımda: **§2.3 ve §5.1**.
- `apps/panel/src/`: **§5.2’de korundu.**

---

**Rapor tamamlandı.** Commit: `docs(fe): blueprint'i nextjs app router (app/) yapısına hizala (FE-BLUEPRINT-UPDATE)`
