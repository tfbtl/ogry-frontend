# FE-INFRA-0003 — Verification Steps

## ⚠️ IMPORTANT: This is a TEMPORARY verification step
**DO NOT commit these env changes to production!**

## 1) Start Mock Backend Server

**Terminal A:**
```bash
cd Ogrency.com/ogry-website
node scripts/mock-backend.cjs
```

Expected output:
```
Mock Backend Server running on http://localhost:3000
Base path: /api/v1
Endpoints:
  GET /api/v1/cabins -> 200 CabinDto[]
  GET /api/v1/cabins/{id} -> 200 CabinDto
  GET /api/v1/health -> 200 { ok: true }
  GET /api/v1/problem -> 400 ProblemDetails
  GET /api/v1/unauthorized -> 401 ProblemDetails
  OPTIONS /api/v1/* -> 204 (CORS preflight)
```

## 2) Set Environment Variables (LOCAL ONLY)

**ogry-website (.env.local or .env):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USE_BACKEND_CABINS=true
```

⚠️ **DO NOT commit .env files with these values!**

## 3) Start Frontend Dev Server

**Terminal B:**
```bash
cd Ogrency.com/ogry-website
npm run dev
```

## 4) Verification Checklist

### ✅ Primary Verification
- [ ] Navigate to Cabins page
- [ ] Cabins list loads successfully
- [ ] Cabin names show "MOCK CABIN ..." prefix (NOT Supabase data)
- [ ] No UI changes were required
- [ ] No frontend console.* added by code changes
- [ ] No boundary/lint violations

### ✅ Secondary Verification (if detail view exists)
- [ ] Open cabin detail page
- [ ] Shows mock cabin by id
- [ ] Data matches mock backend response

### ✅ Error Handling Verification (optional)
- [ ] Test `/api/v1/problem` endpoint → Should show AppError
- [ ] Test `/api/v1/unauthorized` endpoint → Should trigger SessionExpired event

## 5) CLEANUP (MANDATORY)

**After verification, restore env flags:**

**ogry-website:**
```env
NEXT_PUBLIC_USE_BACKEND_CABINS=false
# NEXT_PUBLIC_API_URL can be removed or set to real backend URL
```

## Expected Mock Data

**GET /api/v1/cabins:**
```json
[
  {
    "id": 1,
    "name": "MOCK CABIN Forest Retreat",
    "maxCapacity": 4,
    "regularPrice": 250,
    "discount": 0,
    "description": "Mock cabin in the forest",
    "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "MOCK CABIN Mountain View",
    "maxCapacity": 6,
    "regularPrice": 350,
    "discount": 50,
    "description": "Mock cabin with mountain view",
    "image": "https://images.unsplash.com/photo-1566073771259-6a0b9c2c0b8e",
    "createdAt": "2024-01-02T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  },
  {
    "id": 3,
    "name": "MOCK CABIN Lakeside",
    "maxCapacity": 8,
    "regularPrice": 450,
    "discount": 100,
    "description": "Mock cabin by the lake",
    "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    "createdAt": "2024-01-03T00:00:00Z",
    "updatedAt": "2024-01-03T00:00:00Z"
  }
]
```

**GET /api/v1/cabins/1:**
```json
{
  "id": 1,
  "name": "MOCK CABIN Forest Retreat",
  "maxCapacity": 4,
  "regularPrice": 250,
  "discount": 0,
  "description": "Mock cabin in the forest",
  "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

