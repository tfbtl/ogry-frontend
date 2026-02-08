# FE-PANEL-BLANK-0001 — Panel White Screen Investigation (Evidence-Only)

**document_code:** FE-PANEL-BLANK-0001  
**version:** 1.0.0  
**status:** required  
**authority:** CTO  
**executor:** Implementer AI (Cursor)  
**scope:** apps/panel (RUN + READ-ONLY)  
**risk:** low (no code change)  
**intent:** Panel dev server (Vite) çalışıyor görünmesine rağmen tarayıcıda beyaz ekran alınması sorununu kod değiştirmeden, sadece kanıt toplayarak teşhis etmek.

---

## 1) Amaç & Kapsam

- **Amaç:** Beyaz ekranın nedenini tespit: HTML boş mu, root mount var mı, entry yükleniyor mu, runtime error var mı? Çözüm üretilmez; sadece kanıt raporlanır.
- **Kapsam:** apps/panel; RUN + READ-ONLY (kod değişikliği yasak).

---

## 2) Reproduce Adımları

1. Panel başlatıldı: `pnpm --filter @ogrency/panel dev` (mevcut oturumda zaten çalışıyordu).
2. Panel URL: http://localhost:5173/

---

## 3) HTTP/HTML Kanıtı (status, content-length, snippet)

**Komut:** `Invoke-WebRequest http://localhost:5173/ -UseBasicParsing | Select-Object -ExpandProperty Content`

| Öğe | Değer |
|-----|--------|
| StatusCode | 200 |
| Content length | 1021 karakter |
| Boş mu? | Hayır; HTML anlamlı içerik döndü. |

**İlk ~1000 karakter (snippet):**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">import { injectIntoGlobalHook } from "/@react-refresh";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;</script>

    <script type="module" src="/@vite/client"></script>

    <meta charset="UTF-8" />
    ...
    <title>BTA Panel</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
```

---

## 4) index.html & Entry Script Kanıtı (root id, script src)

**Dosya:** `apps/panel/index.html` (repo)

| Kontrol | Sonuç |
|---------|--------|
| Root container | `<div id="root"></div>` mevcut. |
| Entry script | `<script type="module" src="/src/main.jsx"></script>` mevcut. |

---

## 5) Entry Fetch Sonucu (/src/main.jsx, /@vite/client)

| İstek | StatusCode | Kanıt |
|-------|------------|--------|
| GET http://localhost:5173/src/main.jsx | 200 | Entry script dönüyor. İçerik: `createRoot(document.getElementById("root")).render(...)`, `import App from "/src/App.jsx"`. |
| GET http://localhost:5173/@vite/client | 200 | Vite HMR client dönüyor. |

**main.jsx (serve edilen) mount satırı:**  
`createRoot(document.getElementById("root")).render(...)`

---

## 6) Mount Tutarlılığı (root id vs getElementById)

| Öğe | Değer |
|-----|--------|
| index.html container id | `root` |
| main.jsx aranan id | `document.getElementById("root")` |
| Eşleşme | Evet. |
| React 18 | `createRoot` kullanılıyor (`apps/panel/src/main.jsx`). |

---

## 7) Vite Log Kanıtı (404/500 var mı)

Panel dev server terminal çıktısı (Vite):  
- "VITE v7.3.1  ready in 781 ms", "Local: http://localhost:5173/" görüldü.  
- `/` veya `/src/main.jsx` veya `/@vite/client` isteklerine dair 404/500 satırı logda yer almıyor (sadece ready çıktısı mevcut).

**HTTP header’lar (GET /):**  
StatusCode 200, Content-Type text/html, Content-Length 1021, Cache-Control no-cache, ETag W/"3fd-..."

---

## 8) Runtime Render Check (Kod Okuma)

**İlk render’da koşulsuz çalışan init:**
- `main.jsx`: `createRoot(document.getElementById("root")).render(...)` — sync; root yoksa createRoot(null) hata verir; HTML’de root mevcut.
- `App.jsx`: `DarkModeProvider` → `useLocalStorageState(..., "isDarkMode")` — useState ilk değerde `localStorage.getItem(key)` çağrılıyor; tarayıcıda sync çalışır.
- `ProtectedRoute`: `useUser()` → `useQuery({ queryFn: getCurrentUser })` — ilk render’da useQuery tetiklenir, getCurrentUser → `getCurrentUserUseCase.execute()` → `UserServiceAdapter.getCurrentUser()` → `supabase.auth.getSession()` ve `supabase.auth.getUser()`. Supabase client `composition/supabasePublicClient.ts` ve `composition/config.ts` (VITE_SUPABASE_URL, VITE_SUPABASE_KEY) ile oluşturuluyor; env boşsa client undefined url/anonKey ile oluşabilir, getSession/getUser çağrısında hata oluşma ihtimali var.
- Tarayıcı konsolu veya stack trace bu analizde yok; sadece kod akışı.

**ProtectedRoute render davranışı:**  
`ProtectedRoute` içinde: `if (isLoading) return <FullPage><Spinner /></FullPage>;` ve `if (isAuthenticated) return children;`. Authenticated değilse ve loading bitmişse açık bir return yok; bileşen `undefined` döner, yani React bu dalda hiçbir şey çizmez. `useEffect` ile `navigate("/login")` yapılıyor; yönlendirme gerçekleşene kadar bir kare boyunca ekran boş kalabilir.

---

## 9) Sonuç (Sınıflandırma)

**Sınıflandırma: D) Runtime init crash şüphesi**

- **A) HTML BOŞ / yanlış dönüyor:** Hayır. HTTP 200, 1021 karakter, root ve script tag’leri mevcut.
- **B) Entry script 404 / yüklenmiyor:** Hayır. `/src/main.jsx` ve `/@vite/client` 200 dönüyor.
- **C) Root id mismatch:** Hayır. `id="root"` ile `getElementById("root")` eşleşiyor.
- **D) Runtime init crash şüphesi:** Kanıt: Tarayıcı konsolu/stack yok. İlk anlamlı async akış: `useUser` → `getCurrentUser` → Supabase `getSession`/`getUser`. Supabase client config’i env’den (VITE_SUPABASE_URL, VITE_SUPABASE_KEY); env boşsa client ile yapılan ilk ağ/auth çağrısında hata veya unhandled rejection oluşabilir. Ayrıca ProtectedRoute, authenticated değilken ve loading bittikten sonra hiçbir şey render etmediği için (undefined return) bir frame boyunca beyaz ekran görülebilir; bu davranış kod incelemesi ile tespit edildi.
- **E) Diğer:** Yukarıdaki “ProtectedRoute undefined return” davranışı ek kanıt olarak E kapsamında da sayılabilir; kesin kök neden için tarayıcı konsolu gerekir.

Çözüm veya aksiyon önerisi verilmedi; sadece sınıflandırma ve kanıt raporlandı.
