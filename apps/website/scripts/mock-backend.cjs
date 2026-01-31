/**
 * Mock Backend Server for Cabins API
 * 
 * This is a temporary verification script to test BackendCabinServiceAdapter.
 * It provides a minimal mock API server using only Node.js built-in modules.
 * 
 * Usage:
 *   node scripts/mock-backend.cjs
 * 
 * Environment:
 *   MOCK_PORT=3000 (default)
 * 
 * Endpoints:
 *   GET /api/v1/cabins -> 200 CabinDto[]
 *   GET /api/v1/cabins/{id} -> 200 CabinDto
 *   OPTIONS /api/v1/* -> 204 (CORS preflight)
 *   GET /api/v1/health -> 200 { ok: true }
 *   GET /api/v1/problem -> 400 ProblemDetails (RFC7807)
 *   GET /api/v1/unauthorized -> 401 ProblemDetails
 */

const http = require("http");
const { URL } = require("url");

const PORT = process.env.MOCK_PORT || 3000;
const BASE_PATH = "/api/v1";

// Mock cabins data (obviously mock - names start with "MOCK CABIN")
const mockCabins = [
  {
    id: 1,
    name: "MOCK CABIN Forest Retreat",
    maxCapacity: 4,
    regularPrice: 250,
    discount: 0,
    description: "Mock cabin in the forest",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "MOCK CABIN Mountain View",
    maxCapacity: 6,
    regularPrice: 350,
    discount: 50,
    description: "Mock cabin with mountain view",
    image: "https://images.unsplash.com/photo-1566073771259-6a0b9c2c0b8e",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    name: "MOCK CABIN Lakeside",
    maxCapacity: 8,
    regularPrice: 450,
    discount: 100,
    description: "Mock cabin by the lake",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
];

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Correlation-Id, Authorization",
};

// Send JSON response
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    ...corsHeaders,
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(data));
};

// Send CORS preflight response
const sendCORS = (res) => {
  res.writeHead(204, corsHeaders);
  res.end();
};

// Handle OPTIONS (CORS preflight)
const handleOptions = (res) => {
  sendCORS(res);
};

// Handle GET /api/v1/cabins
const handleGetCabins = (res) => {
  sendJSON(res, 200, mockCabins);
};

// Handle GET /api/v1/cabins/{id}
const handleGetCabinById = (res, id) => {
  const cabin = mockCabins.find((c) => c.id === parseInt(id, 10));
  if (!cabin) {
    sendJSON(res, 404, {
      type: "https://tools.ietf.org/html/rfc7231#section-6.5.4",
      title: "Not Found",
      status: 404,
      detail: `Cabin with id ${id} not found`,
    });
    return;
  }
  sendJSON(res, 200, cabin);
};

// Handle GET /api/v1/health
const handleHealth = (res) => {
  sendJSON(res, 200, { ok: true });
};

// Handle GET /api/v1/problem (400 ProblemDetails sample)
const handleProblem = (res) => {
  sendJSON(res, 400, {
    type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    title: "Bad Request",
    status: 400,
    detail: "This is a sample ProblemDetails response for testing error normalization",
    instance: "/api/v1/problem",
  });
};

// Handle GET /api/v1/unauthorized (401 ProblemDetails)
const handleUnauthorized = (res) => {
  sendJSON(res, 401, {
    type: "https://tools.ietf.org/html/rfc7235#section-3.1",
    title: "Unauthorized",
    status: 401,
    detail: "Authentication required",
    instance: "/api/v1/unauthorized",
  });
};

// Route handler
const handleRequest = (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  // CORS preflight
  if (method === "OPTIONS") {
    handleOptions(res);
    return;
  }

  // Health check
  if (method === "GET" && pathname === `${BASE_PATH}/health`) {
    handleHealth(res);
    return;
  }

  // Problem endpoint (for testing error normalization)
  if (method === "GET" && pathname === `${BASE_PATH}/problem`) {
    handleProblem(res);
    return;
  }

  // Unauthorized endpoint (for testing SessionExpired event)
  if (method === "GET" && pathname === `${BASE_PATH}/unauthorized`) {
    handleUnauthorized(res);
    return;
  }

  // GET /api/v1/cabins
  if (method === "GET" && pathname === `${BASE_PATH}/cabins`) {
    handleGetCabins(res);
    return;
  }

  // GET /api/v1/cabins/{id}
  const cabinIdMatch = pathname.match(new RegExp(`^${BASE_PATH}/cabins/(\\d+)$`));
  if (method === "GET" && cabinIdMatch) {
    const id = cabinIdMatch[1];
    handleGetCabinById(res, id);
    return;
  }

  // 404 for unknown routes
  sendJSON(res, 404, {
    type: "https://tools.ietf.org/html/rfc7231#section-6.5.4",
    title: "Not Found",
    status: 404,
    detail: `Route ${pathname} not found`,
  });
};

// Create server
const server = http.createServer(handleRequest);

// Start server
server.listen(PORT, () => {
  console.log(`Mock Backend Server running on http://localhost:${PORT}`);
  console.log(`Base path: ${BASE_PATH}`);
  console.log(`Endpoints:`);
  console.log(`  GET ${BASE_PATH}/cabins -> 200 CabinDto[]`);
  console.log(`  GET ${BASE_PATH}/cabins/{id} -> 200 CabinDto`);
  console.log(`  GET ${BASE_PATH}/health -> 200 { ok: true }`);
  console.log(`  GET ${BASE_PATH}/problem -> 400 ProblemDetails`);
  console.log(`  GET ${BASE_PATH}/unauthorized -> 401 ProblemDetails`);
  console.log(`  OPTIONS ${BASE_PATH}/* -> 204 (CORS preflight)`);
});

