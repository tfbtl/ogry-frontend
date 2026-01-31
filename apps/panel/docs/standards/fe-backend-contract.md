# FE Backend Contract (SSOT — Contract First)

**Version:** 1.0.0  
**Status:** Required  
**Authority:** CTO  
**Scope:** ogry-panel + ogry-website

---

## Base Configuration

### Base URL
- **Pattern:** `/api/v1`
- **Versioning:** URL-based versioning (`/v1`, `/v2`, etc.)

### Headers

#### Required Headers
- `X-Correlation-Id` (string, required)
  - Client generates unique correlation ID for each request
  - Format: UUID v4 or similar unique identifier
  - Purpose: Request tracing and debugging

#### Conditional Headers
- `Authorization: Bearer <token>` (string, required for authenticated endpoints)
  - JWT token for authenticated requests
  - Format: `Bearer <jwt-token>`

---

## Response Patterns

### Success Response

**UI Layer:**
- UI components **DO NOT** receive `Result<T>` directly
- Adapter layer normalizes backend response to domain models
- UseCase layer handles `Result<T>` internally

**Adapter Layer:**
- Converts backend response → `Result<T>`
- Handles error normalization

### Error Response

#### Backend → Frontend Flow

1. **Backend Response:** RFC7807 `ProblemDetails` format
   ```json
   {
     "type": "https://example.com/probs/validation-error",
     "title": "Validation Error",
     "status": 400,
     "detail": "One or more validation errors occurred",
     "instance": "/api/v1/cabins",
     "errors": {
       "name": ["Name is required"],
       "maxCapacity": ["Must be greater than 0"]
     }
   }
   ```

2. **Adapter Normalization:** `ProblemDetails` → `AppError`
   - Maps HTTP status codes to error codes
   - Extracts validation errors
   - Preserves correlation ID

3. **UI Handling:**
   - `401 Unauthorized` → Triggers `SessionExpired` event
   - `403 Forbidden` → No silent redirect (UI decides)
   - Other errors → Display via toast/error boundary

#### Error Types

| HTTP Status | Error Code | UI Action |
|------------|------------|-----------|
| 400 | `VALIDATION_ERROR` | Show field errors |
| 401 | `UNAUTHORIZED` | Trigger `SessionExpired` event |
| 403 | `FORBIDDEN` | UI decides (no auto-redirect) |
| 404 | `NOT_FOUND` | Show not found message |
| 409 | `CONFLICT` | Show conflict message |
| 500 | `INTERNAL_ERROR` | Show generic error |

---

## Pagination (LIST Endpoints)

### Response Format

```typescript
type PagedResponse<T> = {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
};
```

### Query Parameters

- `pageIndex` (number, default: 0)
- `pageSize` (number, default: 10, max: 100)
- `sortBy` (string, optional)
- `sortDirection` (string: "asc" | "desc", default: "asc")

---

## Endpoint Matrix: Cabins

### GET /cabins

**Description:** Retrieve list of cabins

**Query Parameters:**
- `pageIndex` (number, optional)
- `pageSize` (number, optional)
- `sortBy` (string, optional)
- `sortDirection` (string, optional)

**Response:**
- `200 OK` → `PagedResponse<Cabin>`
- `401 Unauthorized` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)

---

### GET /cabins/{id}

**Description:** Retrieve single cabin by ID

**Path Parameters:**
- `id` (string, required) - Cabin identifier

**Response:**
- `200 OK` → `Cabin`
- `404 Not Found` → `ProblemDetails`
- `401 Unauthorized` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)

---

### POST /cabins

**Description:** Create new cabin

**Request Body:**
```json
{
  "name": "string",
  "maxCapacity": "number",
  "regularPrice": "number",
  "discount": "number",
  "description": "string",
  "image": "File | string"
}
```

**Response:**
- `201 Created` → `Cabin`
- `400 Bad Request` → `ProblemDetails` (validation errors)
- `401 Unauthorized` → `ProblemDetails`
- `409 Conflict` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)
- `Content-Type: multipart/form-data` (if image upload)

---

### PUT /cabins/{id}

**Description:** Update existing cabin

**Path Parameters:**
- `id` (string, required) - Cabin identifier

**Request Body:**
```json
{
  "name": "string",
  "maxCapacity": "number",
  "regularPrice": "number",
  "discount": "number",
  "description": "string",
  "image": "File | string"
}
```

**Response:**
- `200 OK` → `Cabin`
- `400 Bad Request` → `ProblemDetails` (validation errors)
- `401 Unauthorized` → `ProblemDetails`
- `404 Not Found` → `ProblemDetails`
- `409 Conflict` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)
- `Content-Type: multipart/form-data` (if image upload)

---

### DELETE /cabins/{id}

**Description:** Delete cabin by ID

**Path Parameters:**
- `id` (string, required) - Cabin identifier

**Response:**
- `204 No Content` → (empty body)
- `401 Unauthorized` → `ProblemDetails`
- `404 Not Found` → `ProblemDetails`
- `409 Conflict` → `ProblemDetails` (e.g., cabin has active bookings)
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)

---

## Endpoint Matrix: Authentication

### POST /auth/login

**Description:** Authenticate user with email and password

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
- `200 OK` → `AuthSession` (session + user info)
- `400 Bad Request` → `ProblemDetails` (validation errors)
- `401 Unauthorized` → `ProblemDetails` (invalid credentials)
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)

**Notes:**
- Login success → session + user info returned
- Login failure → RFC7807 ProblemDetails
- `401 Unauthorized` → UseCase seviyesinde yakalanır, `SessionExpired` event tetiklenir

---

### POST /auth/logout

**Description:** End user session

**Response:**
- `204 No Content` → (empty body)
- `401 Unauthorized` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)

**Notes:**
- Logout success → `LoggedOut` event tetiklenir
- Token refresh UI tarafından bilinmez (adapter/UseCase seviyesinde handle edilir)

---

### GET /auth/session

**Description:** Get current user session

**Response:**
- `200 OK` → `AuthSession | null` (null if no active session)
- `401 Unauthorized` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required, if session exists)

**Notes:**
- Returns current session if valid
- Returns null if no active session (not an error)
- `401 Unauthorized` → UseCase seviyesinde yakalanır, `SessionExpired` event tetiklenir

---

## Endpoint Matrix: Bookings

### GET /bookings

**Description:** Retrieve list of bookings (Read Model with JOINs)

**Query Parameters:**
- `pageIndex` (number, optional)
- `pageSize` (number, optional)
- `sortBy` (string, optional)
- `sortDirection` (string, optional)
- `filter` (object, optional) - Filter criteria

**Response:**
- `200 OK` → `PagedResponse<Booking>` (Read Model with nested cabins/guests)
- `401 Unauthorized` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)

**Notes:**
- Read Model: JOIN'li, denormalized data (cabins(*), guests(*))
- UI consumes nested structure directly

---

### GET /bookings/{id}

**Description:** Retrieve single booking by ID (Read Model with JOINs)

**Path Parameters:**
- `id` (string, required) - Booking identifier

**Response:**
- `200 OK` → `Booking` (Read Model with nested cabins/guests)
- `404 Not Found` → `ProblemDetails`
- `401 Unauthorized` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)

**Notes:**
- Read Model: JOIN'li, denormalized data
- UI consumes nested structure directly

---

### PATCH /bookings/{id}

**Description:** Update booking (Write Model - IDs only)

**Path Parameters:**
- `id` (string, required) - Booking identifier

**Request Body:**
```json
{
  "status": "string",
  "isPaid": "boolean",
  "hasBreakfast": "boolean",
  "extrasPrice": "number"
}
```

**Response:**
- `200 OK` → `Booking` (Read Model - after update)
- `400 Bad Request` → `ProblemDetails` (validation errors)
- `401 Unauthorized` → `ProblemDetails`
- `404 Not Found` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)

**Notes:**
- Write Model: Normalized (only IDs, no nested objects)
- Response returns Read Model (JOIN'li)

---

### DELETE /bookings/{id}

**Description:** Delete booking by ID

**Path Parameters:**
- `id` (string, required) - Booking identifier

**Response:**
- `204 No Content` → (empty body)
- `401 Unauthorized` → `ProblemDetails`
- `404 Not Found` → `ProblemDetails`
- `409 Conflict` → `ProblemDetails` (e.g., booking cannot be deleted)
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)

---

## Endpoint Matrix: Settings

### GET /settings

**Description:** Retrieve settings (SINGLETON - not a collection)

**Response:**
- `200 OK` → `Settings` (single object, not array)
- `401 Unauthorized` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)

**Notes:**
- Settings is a SINGLETON, not a collection
- Backend always returns a single settings object
- UI accesses fields directly: `settings.breakfastPrice`, not `settings[0].breakfastPrice`

---

### PATCH /settings

**Description:** Update settings (partial update, SINGLETON)

**Request Body:**
```json
{
  "breakfastPrice": "number",
  "minBookingLength": "number",
  "maxBookingLength": "number",
  "maxGuestsPerBooking": "number"
}
```

**Response:**
- `200 OK` → `Settings` (updated settings object)
- `400 Bad Request` → `ProblemDetails` (validation errors)
- `401 Unauthorized` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)

**Notes:**
- Partial update (only changed fields)
- Returns updated settings object (Read Model)
- Settings is SINGLETON, update always affects the same record

---

## Endpoint Matrix: Users

### POST /users/signup

**Description:** Create new user account (User registration, NOT Auth)

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
- `201 Created` → `UserProfile`
- `400 Bad Request` → `ProblemDetails` (validation errors)
- `409 Conflict` → `ProblemDetails` (email already exists)
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)

**Notes:**
- This is **User registration**, NOT authentication
- Auth (login/session) is handled separately via `/auth/login`
- Token doğrulama backend tarafında yapılır
- Frontend bu ayrımı bilir: **Auth ≠ User**

---

### GET /users/me

**Description:** Get current user profile (Read Model)

**Response:**
- `200 OK` → `UserProfile`
- `401 Unauthorized` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)

**Notes:**
- Returns current authenticated user's profile
- Token doğrulama backend tarafında yapılır
- This is **User data**, NOT session/auth data

---

### PATCH /users/me

**Description:** Update current user profile (Write Model - partial update)

**Request Body:**
```json
{
  "fullName": "string",
  "avatar": "File | string"
}
```

**Response:**
- `200 OK` → `UserProfile` (updated profile)
- `400 Bad Request` → `ProblemDetails` (validation errors)
- `401 Unauthorized` → `ProblemDetails`
- `500 Internal Server Error` → `ProblemDetails`

**Headers:**
- `X-Correlation-Id` (required)
- `Authorization` (required)
- `Content-Type: multipart/form-data` (if avatar upload)

**Notes:**
- Partial update (only changed fields)
- Avatar upload handled by backend (File → URL conversion)
- UI and UseCase do NOT know about storage details
- Returns updated UserProfile (Read Model)

---

## Domain Models

### UserProfile (Read Model - UI Consumption)

```typescript
type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role?: string;
  user_metadata?: {
    fullName?: string;
    avatar?: string;
  };
  // ... other profile fields
};
```

**Important:** This is **User data**, NOT Auth data. Auth handles session/tokens, User handles profile/preferences.

### SignupInput (Write Model)

```typescript
type SignupInput = {
  fullName: string;
  email: string;
  password: string;
};
```

### UpdateUserInput (Write Model - Partial)

```typescript
type UpdateUserInput = {
  fullName?: string;
  avatar?: File | string; // File for upload, string for existing URL
  password?: string;
};
```

**Note:** Avatar can be File (for upload) or string (existing URL). Adapter handles File → URL conversion.

### Settings (Read Model - SINGLETON)

```typescript
type Settings = {
  id: number;
  breakfastPrice: number;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  // ... other settings fields
};
```

**Important:** Settings is a SINGLETON object, NOT an array. UI accesses fields directly:
- ✅ `settings.breakfastPrice`
- ❌ `settings[0].breakfastPrice` (WRONG)

### UpdateSettingsInput (Write Model - Partial)

```typescript
type UpdateSettingsInput = {
  breakfastPrice?: number;
  minBookingLength?: number;
  maxBookingLength?: number;
  maxGuestsPerBooking?: number;
  // ... other optional fields
};
```

**Note:** All fields are optional (partial update).

### Booking (Read Model - JOIN'li)

```typescript
type Booking = {
  id: string;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  status: "unconfirmed" | "checked-in" | "checked-out";
  totalPrice: number;
  cabinPrice?: number;
  extrasPrice?: number;
  hasBreakfast?: boolean;
  observations?: string;
  isPaid?: boolean;
  // Nested objects (JOIN'li Read Model)
  cabins: {
    name: string;
    // ... other cabin fields as needed
  };
  guests: {
    fullName: string;
    email: string;
    country?: string;
    countryFlag?: string;
    nationalID?: string;
    // ... other guest fields as needed
  };
};
```

### BookingInput (Write Model - IDs only)

```typescript
type BookingInput = {
  status?: "unconfirmed" | "checked-in" | "checked-out";
  isPaid?: boolean;
  hasBreakfast?: boolean;
  extrasPrice?: number;
  cabinPrice?: number;
  totalPrice?: number;
  observations?: string;
  // Note: No nested objects - only flat fields
};
```

### AuthSession

```typescript
type AuthSession = {
  session: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
    expires_in?: number;
    token_type: string;
  };
  user: AuthUser;
};
```

### AuthUser

```typescript
type AuthUser = {
  id: string;
  email: string;
  role?: string;
  user_metadata?: {
    fullName?: string;
    avatar?: string;
  };
  app_metadata?: Record<string, unknown>;
};
```

### Cabin

```typescript
type Cabin = {
  id: string;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string; // URL
  createdAt?: string; // ISO 8601
  updatedAt?: string; // ISO 8601
};
```

---

## Provider Differences

### ⚠️ SSOT: Provider Implementation Differences

This section documents **intentional** differences between repositories due to different auth providers. These differences are **NOT bugs** and should **NOT** be "fixed" without explicit architectural decision.

#### ogry-panel

**Auth Provider:** Supabase (temporary)  
**Future:** Backend Auth API

**IAuthService Implementation:**
- ✅ `login()` — **Fully implemented**
- ✅ `logout()` — **Fully implemented**
- ✅ `getSession()` — **Fully implemented**

All three methods are fully functional and return `Result<T>` with proper error handling.

---

#### ogry-website

**Auth Provider:** NextAuth (OAuth-based)  
**Future:** Backend Auth API (when migrating from NextAuth)

**IAuthService Implementation:**
- ❌ `login()` — **NOT_IMPLEMENTED** (returns `Result<AuthSession>` with `NOT_IMPLEMENTED` error)
  - **Reason:** NextAuth uses OAuth providers (Google, etc.), not email/password
  - **Current Flow:** Login handled at route/UI level via NextAuth `signIn()`
  - **UI Impact:** UI never sees this error (adapter layer only)
- ❌ `logout()` — **NOT_IMPLEMENTED** (returns `Result<void>` with `NOT_IMPLEMENTED` error)
  - **Reason:** Logout handled by NextAuth `signOut()` at route/UI level
  - **Current Flow:** NextAuth manages session termination
  - **UI Impact:** UI never sees this error (adapter layer only)
- ✅ `getSession()` — **Fully implemented**
  - Returns NextAuth session converted to `AuthSession` format
  - Note: Tokens are not exposed (NextAuth security design)

**Important Notes:**
- This behavior is **EXPECTED** and **INTENTIONAL**
- It is **NOT a bug** to be fixed
- UI layer never receives `NOT_IMPLEMENTED` errors (handled in adapter)
- Future backend migration will implement all three methods uniformly

---

## Implementation Notes

1. **Contract First:** This document is the SSOT (Single Source of Truth)
2. **Adapter Responsibility:** Adapter layer handles all HTTP concerns
3. **UseCase Isolation:** UseCase layer is HTTP-agnostic
4. **UI Simplicity:** UI layer only knows domain models, not HTTP details
5. **Provider Differences:** Documented above are intentional and should not be "fixed" without architectural decision

---

**Last Updated:** 2025-01-30  
**Maintainer:** Frontend Team

