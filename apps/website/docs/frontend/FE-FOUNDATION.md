# FE-FOUNDATION

## Folder boundaries
- UI paths (`app/_components`, `app/(routes)`) must not import `supabase` or call `fetch` directly.
- Supabase access is isolated to `app/_lib/data/supabaseAdapter/*`.
- `app/_lib/supabase.js` may exist but only adapter imports it.

## foundation.ts içerikleri (SSOT)
- SSOT: `app/_lib/shared/types/foundation.ts`
- Types: `Result<T>`, `AppError`, `UIFriendlyError` (and optional `PagedResponse<T>` if needed).

## apiClient sorumlulukları + Result<T> dönüşleri
- Client: `app/_lib/api/apiClient.ts`
- Adds `X-Correlation-Id` per request.
- Normalizes ProblemDetails to `AppError`.
- Always returns `Promise<Result<T>>` and never throws.

## ProblemDetails → AppError akışı
- Normalizer: `app/_lib/api/problemDetails.ts`
- Maps `errors`/`validationErrors` to `AppError.validationErrors`.
- Uses `clientTimestamp` as ISO string.

## AuthEvent + authStateReset akışı (zombi veri)
- Events: `app/_lib/auth/authEvents.ts` (`SessionExpired`, `LoggedOut`).
- Reset: `app/_lib/auth/authStateReset.ts`

## Supabase isolation kuralları + unsafe cast politikası
- Supabase imports are only allowed in `supabaseAdapter`.
- Adapter functions must validate basic payload shape.
- `as T` casting is forbidden in adapters unless marked with `// UNSAFE_CAST: reason`.

## Server actions serialization notları
- `Result<T>` and `AppError` must remain JSON-serializable.
- No `Date`, `Map`, `Set`, functions, or `undefined` array items in responses.
- `clientTimestamp` must be ISO string.

## Google OAuth redirect URI
- Standard callback URL: `http://localhost:3000/api/auth/callback/google`
- Google Cloud Console'da bu URL'i authorized redirect URIs listesine ekleyin.

## rg komutlarıyla doğrulama
- `rg "supabase" app/_components app/(routes) app/_lib/actions.js app/_lib/data-service.js`
- `rg "console\\.(log|error|warn)" app/_components app/(routes)`

