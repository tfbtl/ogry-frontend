# FE-FOUNDATION

## Folder boundaries
- UI paths (`src/ui`, `src/pages`, `src/features/**`) must not import `supabase` or call `fetch` directly.
- Supabase access is isolated to `src/services/data/supabaseAdapter/*`.
- `src/services/supabase.js` may exist but only adapter imports it.

## foundation.ts içerikleri (SSOT)
- SSOT: `src/shared/types/foundation.ts`
- Types: `Result<T>`, `AppError`, `UIFriendlyError` (and optional `PagedResponse<T>` if needed).

## apiClient sorumlulukları + Result<T> dönüşleri
- Client: `src/services/http/apiClient.ts`
- Adds `X-Correlation-Id` per request.
- Normalizes ProblemDetails to `AppError`.
- Always returns `Promise<Result<T>>` and never throws.

## ProblemDetails → AppError akışı
- Normalizer: `src/services/http/problemDetails.ts`
- Maps `errors`/`validationErrors` to `AppError.validationErrors`.
- Uses `clientTimestamp` as ISO string.

## AuthEvent + authStateReset akışı (zombi veri)
- Events: `src/services/auth/authEvents.ts` (`SessionExpired`, `LoggedOut`).
- Reset: `src/services/auth/authStateReset.ts`
- Note: `queryClient.clear()` is intentionally aggressive at this stage.

## Supabase isolation kuralları + unsafe cast politikası
- Supabase imports are only allowed in `supabaseAdapter`.
- Adapter functions must validate basic payload shape.
- `as T` casting is forbidden in adapters unless marked with `// UNSAFE_CAST: reason`.

## Server actions serialization notları
- `Result<T>` and `AppError` must remain JSON-serializable.
- No `Date`, `Map`, `Set`, functions, or `undefined` array items in responses.
- `clientTimestamp` must be ISO string.

## rg komutlarıyla doğrulama
- `rg "supabase" src/features src/ui src/pages`
- `rg "supabase" src/services`
- `rg "console\\.(log|error|warn)" src/ui src/pages`

