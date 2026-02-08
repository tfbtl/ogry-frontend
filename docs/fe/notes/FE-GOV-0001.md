# FE-GOV-0001 — Governance Level-Up (Policy + Enforcement Handshake + Break-Glass)

**document_code:** FE-GOV-0001  
**version:** 1.1.0  
**status:** tamamlandı  
**tarih:** 2026-02-08  
**yürütücü:** Implementer AI (Cursor)

---

## Özet

Repo kökünde yönetişim anayasası (GOVERNANCE.md), katkı rehberi (CONTRIBUTING.md) ve acil durum “Break Glass” protokolü tanımlandı. Sadece doküman değişikliği; kod veya gate script’i değiştirilmedi.

**Amaç:** Yazılı kuralları (Policy) ve GitHub Branch Protection ile uygulama el sıkışmasını (Enforcer) tanımlamak; kontrollü Admin Bypass (Break Glass) protokolünü eklemek.  
**Risk:** Düşük (yalnızca doküman)  
**Sonuç:** ✅ **TAMAMLANDI**

---

## Oluşturulan / Güncellenen Dosyalar

| Dosya | İşlem |
|-------|--------|
| `GOVERNANCE.md` | Oluşturuldu (repo kökü) |
| `CONTRIBUTING.md` | Oluşturuldu (repo kökü) |
| `docs/fe/notes/FE-GOV-0001.md` | Oluşturuldu (bu rapor) |

**Değiştirilmeyenler:** Kod, gate script’leri, yeni araç; yalnızca doküman.

---

## Kural Özeti

### GOVERNANCE.md (Anayasa)

1. **Yetki / SSOT** — Blueprint v2.4.0 (`docs/fe/frontend-blueprint-tree.md`) teknik anayasa; `tools/gates/**` CI’da zorunlu.
2. **Dal stratejisi** — `main` korumalı; doğrudan push yok. İş dalları: `feature/*`, `fix/*`, `chore/*`, `refactor/*`, `hotfix/*`. Birleştirme yalnızca PR ile (Break Glass hariç).
3. **Zorunlu kontroller** — `pnpm -w run validate:env-imports`, `lint`, `build` (ve varsa `test`) PASS olmalı.
4. **Commit konvansiyonu** — Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`.
5. **AI kuralları** — AI SSOT dokümanlarını okumalı; gate atlamamalı, force-push yapmamalı; ihlal veya mantık değişikliğinde HARD STOP & REPORT.
6. **Break Glass** — Sadece Admin, sadece felaket senaryosunda doğrudan `main` push. Aynı gün (veya ertesi iş günü): Incident Log (`docs/incidents/INC-YYYY-XXX.md`) + takip PR (durum normale döndürme, gerekirse test/gate güncelleme, incident id referansı).
7. **Enforcement handshake** — Politika, GitHub Branch Protection açıldığında gerçek uygulayıcıya kavuşur; FE-GOV-0002 CTO checklist’i GOVERNANCE.md içinde listelenir.

### CONTRIBUTING.md (El Kitabı)

- **Quick Start** — Dal örnekleri, yerel komutlar: `validate:env-imports`, `lint`, `build` (ve varsa `test`).
- **PR checklist** — Ne değişti / neden, doğrulama komutları ve sonuçları, risk notları, SSOT dokümanları.
- **Inline PR şablonu** — Başlık, açıklama, doğrulama, risk, referanslar (kopyala-yapıştır).
- **Hard Stops** — Gate fail, client’ın server kodu import etmesi, deep import, env’in composition/server dışında okunması, Blueprint dışı klasör kullanımı → merge edilmez.

---

## Doğrulama (Verification)

- **Markdown:** Dosyalar geçerli Markdown; render kontrolü yapıldı.
- **Komutlar:** Root `package.json` script’leri kontrol edildi:
  - `validate:env-imports` ✅
  - `lint` ✅
  - `build` ✅
  - `test` ❌ (repo’da yok; dokümanlarda “varsa” şeklinde referans verildi)

Referans verilen tüm komutlar mevcut; olmayan `test` zorunlu listede “if exists” ile belirtildi.

---

## FE-GOV-0002 CTO Checklist (Özet)

GOVERNANCE.md §7 içinde tam liste yer alıyor. Özet:

- [ ] `main` koruması: Açık  
- [ ] Merge öncesi PR zorunlu  
- [ ] Status check’ler zorunlu: `validate:env-imports`, `lint`, `build` (ve varsa `test`)  
- [ ] Push kısıtı: Sadece yetkili (Break Glass için Admin)  
- [ ] Include administrators: OFF (Break Glass) / ON (daha sıkı) — CTO kararı  
- [ ] Force push / branch silme: Kapalı  
- [ ] Bypass kullanılırsa: Incident Log + takip PR zorunlu  

Detay ve tam metin: **GOVERNANCE.md**, bölüm 7.

---

## Commit & Push

**Commit mesajı:** `docs(gov): establish governance policy, handbook & break-glass protocol (FE-GOV-0001)`  
**Branch:** main  
**Push:** (işlem sonrası raporlanacak)

---

**Rapor tamamlandı:** 2026-02-08  
**Görev durumu:** ✅ TAMAMLANDI
