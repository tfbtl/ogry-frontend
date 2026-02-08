# FE-FOUNDATION

## Folder boundaries
- UI paths (`app/lib/components`, `app/(routes)`) must not import `supabase` or call `fetch` directly.
- Supabase access is isolated to `app/lib/data/supabaseAdapter/*`.
- `app/lib/supabase.js` may exist but only adapter imports it.

## foundation.ts içerikleri (SSOT)
- SSOT: `app/lib/shared/types/foundation.ts`
- Types: `Result<T>`, `AppError`, `UIFriendlyError` (and optional `PagedResponse<T>` if needed).

## apiClient sorumlulukları + Result<T> dönüşleri
- Client: `app/lib/api/apiClient.ts`
- Adds `X-Correlation-Id` per request.
- Normalizes ProblemDetails to `AppError`.
- Always returns `Promise<Result<T>>` and never throws.

## ProblemDetails → AppError akışı
- Normalizer: `app/lib/api/problemDetails.ts`
- Maps `errors`/`validationErrors` to `AppError.validationErrors`.
- Uses `clientTimestamp` as ISO string.

## AuthEvent + authStateReset akışı (zombi veri)
- Events: `app/lib/auth/authEvents.ts` (`SessionExpired`, `LoggedOut`).
- Reset: `app/lib/auth/authStateReset.ts`

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
- `rg "supabase" app/lib/components app/(routes) app/lib/actions.js app/lib/data-service.js`
- `rg "console\\.(log|error|warn)" app/lib/components app/(routes)`

