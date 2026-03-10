# Runs Endpoints

## Overview

The runs endpoints manage run data and tracking information. All endpoints are **protected** and require a valid JWT token in the `Authorization: Bearer <token>` header. The user ID is automatically extracted from the JWT token and used to filter data access.

> **Note:** Normal users can only access their own runs. Attempting to access another user's run will result in a `403 Forbidden` or `404 Not Found` error.

> **Note**: The raw sensor data fields (`dataLeft` and `dataRight`) can contain large arrays of numbers. The time series data is not included in limited runs to reduce payload size. The website graphs assume 1 second intervals. Communicate with the harware team to understand the structure and meaning of the sensor data if you need to work with it.

## Endpoints

### Get All Runs

Retrieves all runs for the authenticated user.

**Endpoint:** `GET /api/runs`

**Authentication:** Required

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (1-indexed). If provided without `pagesize`, defaults `pagesize` to 50. |
| `pagesize` | number | No | Number of runs per page. If provided without `page`, defaults to page 1. |

**Pagination Behavior:**
- If neither parameter is provided, all runs are returned
- If only `pagesize` is provided, returns first page (page 1)
- If only `page` is provided, uses `pagesize = 50`
- Results are sorted by `began` date in descending order (newest first)

**Success Response:**

- **Status:** 200 OK
- **Body:** Array of Run objects

```json
[
  {
    "id": "string",
    "userId": "string",
    "began": "ISO date string",
    "distanceKm": number,
    "duration": number,
    "steps": number,
    "dataLeft": [number],
    "avgLeft": number,
    "dataRight": [number],
    "avgRight": number
  }
]
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique run identifier |
| `userId` | string | ID of the user who created the run |
| `began` | ISO date | Timestamp when the run started |
| `distanceKm` | number | Distance covered in kilometers |
| `duration` | number | Duration of the run in seconds |
| `steps` | number | Total number of steps taken |
| `dataLeft` | array of numbers | Sensor data from left side |
| `avgLeft` | number | Average of left side data |
| `dataRight` | array of numbers | Sensor data from right side |
| `avgRight` | number | Average of right side data |

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Invalid or expired token |
| `500` | Internal Server Error | Server error retrieving runs |

**Examples:**

```bash
# Get all runs
curl -X GET http://localhost:3000/api/runs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get first 25 runs
curl -X GET "http://localhost:3000/api/runs?pagesize=25" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get page 2 with 10 runs per page
curl -X GET "http://localhost:3000/api/runs?page=2&pagesize=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Get Limited-Data Runs

Retrieves all runs with limited data for the authenticated user. The limited runs endpoint returns the same run objects but with only a subset of fields included (e.g. excluding raw sensor data) to allow for faster retrieval when full details are not needed.

**Endpoint:** `GET /api/runs/limited`

**Authentication:** Required

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (1-indexed). If provided without `pagesize`, defaults `pagesize` to 50. |
| `pagesize` | number | No | Number of runs per page. If provided without `page`, defaults to page 1. |

**Pagination Behavior:**
- If neither parameter is provided, all runs are returned
- If only `pagesize` is provided, returns first page (page 1)
- If only `page` is provided, uses `pagesize = 50`
- Results are sorted by `began` date in descending order (newest first)

**Success Response:**

- **Status:** 200 OK
- **Body:** Array of Run objects (limited set)

```json
[
  {
    "id": "string",
    "userId": "string",
    "began": "ISO date string",
    "distanceKm": number,
    "duration": number,
    "steps": number,
    "avgLeft": number,
    "avgRight": number
  }
]
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Invalid or expired token |
| `500` | Internal Server Error | Server error retrieving runs |

**Examples:**

```bash
# Get all limited runs
curl -X GET http://localhost:3000/api/runs/limited \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get first page with 20 runs
curl -X GET "http://localhost:3000/api/runs/limited?pagesize=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get page 3 with default 50 runs per page
curl -X GET "http://localhost:3000/api/runs/limited?page=3" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Get Limited-Data Runs After Date

Retrieves all runs with limited data for the authenticated user that occurred after a specified date.

**Endpoint:** `GET /api/runs/limited-after`

**Authentication:** Required

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | ISO date string | Yes | Starting date for the query (inclusive) |
| `page` | number | No | Page number (1-indexed). If provided without `pagesize`, defaults `pagesize` to 50. |
| `pagesize` | number | No | Number of runs per page. If provided without `page`, defaults to page 1. |

**Pagination Behavior:**
- If neither `page` nor `pagesize` is provided, all matching runs are returned
- If only `pagesize` is provided, returns first page (page 1)
- If only `page` is provided, uses `pagesize = 50`
- Results are sorted by `began` date in descending order (newest first)

**Success Response:**

- **Status:** 200 OK
- **Body:** Array of Run objects

```json
[
  {
    "id": "string",
    "userId": "string",
    "began": "ISO date string",
    "distanceKm": number,
    "duration": number,
    "steps": number,
    "avgLeft": number,
    "avgRight": number
  }
]
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `400` | Bad Request | Invalid 'from' date format |
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Invalid or expired token |
| `500` | Internal Server Error | Server error retrieving runs |

**Examples:**

```bash
# Get all runs after a date
curl -X GET "http://localhost:3000/api/runs/limited-after?from=2024-01-01T00:00:00Z" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get first 15 runs after a date
curl -X GET "http://localhost:3000/api/runs/limited-after?from=2024-01-01T00:00:00Z&pagesize=15" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get page 2 after a date (default 50 per page)
curl -X GET "http://localhost:3000/api/runs/limited-after?from=2024-01-01T00:00:00Z&page=2" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Get Limited-Data Runs Between Dates

Retrieves all runs with limited data for the authenticated user that occurred between two specified dates.

**Endpoint:** `GET /api/runs/limited-between`

**Authentication:** Required

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | ISO date string | Yes | Starting date for the query (inclusive) |
| `to` | ISO date string | Yes | Ending date for the query (inclusive) |
| `page` | number | No | Page number (1-indexed). If provided without `pagesize`, defaults `pagesize` to 50. |
| `pagesize` | number | No | Number of runs per page. If provided without `page`, defaults to page 1. |

**Pagination Behavior:**
- If neither `page` nor `pagesize` is provided, all matching runs are returned
- If only `pagesize` is provided, returns first page (page 1)
- If only `page` is provided, uses `pagesize = 50`
- Results are sorted by `began` date in descending order (newest first)

**Success Response:**

- **Status:** 200 OK
- **Body:** Array of Run objects

```json
[
  {
    "id": "string",
    "userId": "string",
    "began": "ISO date string",
    "distanceKm": number,
    "duration": number,
    "steps": number,
    "avgLeft": number,
    "avgRight": number
  }
]
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `400` | Bad Request | Invalid 'from' or 'to' date format |
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Invalid or expired token |
| `500` | Internal Server Error | Server error retrieving runs |

**Examples:**

```bash
# Get all runs between two dates
curl -X GET "http://localhost:3000/api/runs/limited-between?from=2024-01-01T00:00:00Z&to=2024-01-31T23:59:59Z" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get first 20 runs in date range
curl -X GET "http://localhost:3000/api/runs/limited-between?from=2024-01-01T00:00:00Z&to=2024-01-31T23:59:59Z&pagesize=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get page 2 in date range (default 50 per page)
curl -X GET "http://localhost:3000/api/runs/limited-between?from=2024-01-01T00:00:00Z&to=2024-01-31T23:59:59Z&page=2" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Get Single Run

Retrieves a specific run by ID. Users can only access their own runs.

**Endpoint:** `GET /api/runs/:id`

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The run ID to retrieve |

**Success Response:**

- **Status:** 200 OK
- **Body:** Run object

```json
{
  "id": "string",
  "userId": "string",
  "began": "ISO date string",
  "distanceKm": number,
  "duration": number,
  "steps": number,
  "dataLeft": [number],
  "avgLeft": number,
  "dataRight": [number],
  "avgRight": number
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Invalid or expired token |
| `404` | Not Found | Run not found or user does not have access |
| `500` | Internal Server Error | Server error retrieving run |

**Example:**

```bash
curl -X GET http://localhost:3000/api/runs/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Create Run

Creates a new run record. **The user ID is automatically attached to the run based on the JWT token** - you do not need to provide it in the request body.

**Endpoint:** `POST /api/runs`

**Authentication:** Required

**Request Body:**

```json
{
  "began": "ISO date string",
  "distanceKm": number,
  "duration": number,
  "dataLeft": [number],
  "avgLeft": number,
  "dataRight": [number],
  "avgRight": number
}
```

**Required Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `began` | ISO date string | **Required** - Timestamp when the run started |

**Optional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `distanceKm` | number | Distance covered in kilometers |
| `duration` | number | Duration of the run in seconds |
| `dataLeft` | array of numbers | Sensor data from left side |
| `avgLeft` | number | Average of left side data |
| `dataRight` | array of numbers | Sensor data from right side |
| `avgRight` | number | Average of right side data |

**Automatic Fields:**

- `userId` - Automatically set to the authenticated user's ID from the JWT token
- `id` - Automatically generated

**Success Response:**

- **Status:** 201 Created
- **Body:** Created Run object

```json
{
  "id": "string",
  "userId": "string",
  "began": "ISO date string",
  "distanceKm": number,
  "duration": number,
  "steps": number,
  "dataLeft": [number],
  "avgLeft": number,
  "dataRight": [number],
  "avgRight": number
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `400` | Bad Request | Missing required 'began' field or other validation error |
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Invalid or expired token |
| `500` | Internal Server Error | Server error creating run |

**Example:**

```bash
curl -X POST http://localhost:3000/api/runs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "began": "2024-01-15T08:30:00Z",
    "distanceKm": 5.2,
    "duration": 1800,
    "steps": 6500,
    "dataLeft": [45, 52, 48, 55],
    "avgLeft": 50,
    "dataRight": [48, 51, 49, 52],
    "avgRight": 50
  }'
```

---

### Update Run

Updates an existing run. Users can only update their own runs.

**Endpoint:** `PUT /api/runs/:id`

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The run ID to update |

**Request Body:**

```json
{
  "distanceKm": number,
  "duration": number,
  "dataLeft": [number],
  "avgLeft": number,
  "dataRight": [number],
  "avgRight": number
}
```

**Updateable Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `distanceKm` | number | Distance covered in kilometers |
| `duration` | number | Duration of the run in seconds |
| `dataLeft` | array of numbers | Sensor data from left side |
| `avgLeft` | number | Average of left side data |
| `dataRight` | array of numbers | Sensor data from right side |
| `avgRight` | number | Average of right side data |

**Protected Fields:**

- `id` - Cannot be changed
- `userId` - Cannot be changed
- `began` - Cannot be changed

**Success Response:**

- **Status:** 200 OK
- **Body:** Updated Run object

```json
{
  "id": "string",
  "userId": "string",
  "began": "ISO date string",
  "distanceKm": number,
  "duration": number,
  "steps": number,
  "dataLeft": [number],
  "avgLeft": number,
  "dataRight": [number],
  "avgRight": number
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | User does not have permission to update this run or invalid token |
| `404` | Not Found | Run not found |
| `500` | Internal Server Error | Server error updating run |

**Example:**

```bash
curl -X PUT http://localhost:3000/api/runs/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "distanceKm": 5.5,
    "duration": 1850,
    "steps": 6750
  }'
```

---

### Delete Run

Deletes an existing run. Users can only delete their own runs.

**Endpoint:** `DELETE /api/runs/:id`

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The run ID to delete |

**Success Response:**

- **Status:** 204 No Content
- **Body:** Empty

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | User does not have permission to delete this run or invalid token |
| `404` | Not Found | Run not found |
| `500` | Internal Server Error | Server error deleting run |

**Example:**

```bash
curl -X DELETE http://localhost:3000/api/runs/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Data Model

### Run Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique run identifier (auto-generated) |
| `userId` | string | ID of the user who owns the run (auto-attached from JWT) |
| `began` | ISO date | **Required** - When the run started |
| `distanceKm` | number | Distance covered in kilometers |
| `duration` | number | Duration of the run in seconds |
| `steps` | number | Total number of steps taken |
| `dataLeft` | array of numbers | Sensor data measurements from left side |
| `avgLeft` | number | Average value of left side data |
| `dataRight` | array of numbers | Sensor data measurements from right side |
| `avgRight` | number | Average value of right side data |

---

## Access Control

All runs endpoints enforce user-based access control:

- Users can only view, update, and delete their own runs
- The `userId` field is automatically extracted from the JWT token
- Attempting to access another user's run will return a `403 Forbidden` or `404 Not Found` error
- No explicit `userId` parameter is needed - it is always derived from authentication

---

## Query Examples

### Get runs from the last 7 days

```bash
START_DATE=$(date -u -d '-7 days' +%Y-%m-%dT%H:%M:%SZ)
curl -X GET "http://localhost:3000/api/runs/limited-after?from=${START_DATE}" \
  -H "Authorization: Bearer <token>"
```

### Create and retrieve a run

```bash
# Create a run
RESPONSE=$(curl -X POST http://localhost:3000/api/runs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "began": "2024-01-15T08:30:00Z",
    "distanceKm": 5.2,
    "duration": 1800
  }')

# Extract run ID
RUN_ID=$(echo $RESPONSE | jq -r '.id')

# Retrieve the run
curl -X GET http://localhost:3000/api/runs/$RUN_ID \
  -H "Authorization: Bearer <token>"
```
