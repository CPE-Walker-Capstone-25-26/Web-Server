# User Endpoints

## Overview

The user endpoints manage user profiles and data sharing. All endpoints are **protected** and require a valid JWT token in the `Authorization: Bearer <token>` header.

### Relationship with Auth Service

Users are created during the registration process via the `/api/auth/register` endpoint. The auth service automatically creates a user profile with default values when a new account is registered. The user profile is then managed through these user endpoints. The user's `id` field corresponds to their username, which is the same identifier used in JWT tokens.

- **User Creation:** Happens automatically during `/api/auth/register`
- **User Profile Access:** Retrieved via `/api/auth/me` or `/api/users/:id`
- **User Updates:** Managed through `/api/users/:id` PUT endpoint

## Endpoints

### Get All Users

Retrieves all user profiles in the system.

**Endpoint:** `GET /api/users`

**Authentication:** Required

**Query Parameters:** None

**Success Response:**

- **Status:** 200 OK
- **Body:** Array of User objects

```json
[
  {
    "id": "string",
    "name": "string",
    "tocAccepted": boolean,
    "tocVersion": "string",
    "tocTimestamp": "ISO date string",
    "shares": [
      {
        "withUserId": "string",
        "mode": "temporary | indefinite",
        "sharedAt": "ISO date string",
        "expiresAt": "ISO date string"
      }
    ],
    "receives": [
      {
        "withUserId": "string",
        "mode": "temporary | indefinite",
        "sharedAt": "ISO date string",
        "expiresAt": "ISO date string"
      }
    ],
    "usage": [number],
    "isDeleted": boolean,
    "deletedAt": "ISO date string"
  }
]
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Invalid or expired token |
| `500` | Internal Server Error | Server error retrieving users |

**Example:**

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Get Single User

Retrieves a specific user profile by username/ID.

**Endpoint:** `GET /api/users/:id`

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The user's ID (username) |

**Success Response:**

- **Status:** 200 OK
- **Body:** User object

```json
{
  "id": "string",
  "name": "string",
  "tocAccepted": boolean,
  "tocVersion": "string",
  "tocTimestamp": "ISO date string",
  "shares": [
    {
      "withUserId": "string",
      "mode": "temporary | indefinite",
      "sharedAt": "ISO date string",
      "expiresAt": "ISO date string"
    }
  ],
  "receives": [
    {
      "withUserId": "string",
      "mode": "temporary | indefinite",
      "sharedAt": "ISO date string",
      "expiresAt": "ISO date string"
    }
  ],
  "usage": [number],
  "isDeleted": boolean,
  "deletedAt": "ISO date string"
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Invalid or expired token |
| `404` | Not Found | User not found |
| `500` | Internal Server Error | Server error retrieving user |

**Example:**

```bash
curl -X GET http://localhost:3000/api/users/john_doe \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Create User

Creates a new user profile. **Note:** Users are typically created automatically during registration via `/api/auth/register`. This endpoint is available if you need to create a user profile independently.

**Endpoint:** `POST /api/users`

**Authentication:** Required

**Request Body:**

```json
{
  "id": "string",
  "name": "string",
  "tocAccepted": boolean,
  "tocVersion": "string",
  "tocTimestamp": "ISO date string",
  "shares": [],
  "receives": [],
  "usage": [number],
  "isDeleted": boolean,
  "deletedAt": "ISO date string"
}
```

**Required Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique user identifier (username) |
| `name` | string | User's display name |
| `tocAccepted` | boolean | Whether user has accepted terms of service |

**Optional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `tocVersion` | string | Version of ToS accepted |
| `tocTimestamp` | ISO date | When ToS was accepted |
| `shares` | array | List of DataShare objects for users this user shares with |
| `receives` | array | List of DataShare objects for users sharing with this user |
| `usage` | array of numbers | User's usage tracking data |
| `isDeleted` | boolean | Whether account is marked for deletion |
| `deletedAt` | ISO date | When account was marked for deletion |

**Success Response:**

- **Status:** 201 Created
- **Body:** Created User object

```json
{
  "id": "string",
  "name": "string",
  "tocAccepted": boolean,
  "tocVersion": "string",
  "tocTimestamp": "ISO date string",
  "shares": [],
  "receives": [],
  "usage": [number],
  "isDeleted": boolean,
  "deletedAt": "ISO date string"
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `400` | Bad Request | Validation error in request body |
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Invalid or expired token |
| `500` | Internal Server Error | Server error creating user |

**Example:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "id": "jane_doe",
    "name": "Jane Doe",
    "tocAccepted": true,
    "tocVersion": "1.0",
    "tocTimestamp": "2024-01-01T00:00:00Z",
    "shares": [],
    "receives": [],
    "usage": [],
    "isDeleted": false
  }'
```

---

### Update User

Updates a user's profile. Users can only update their own profile (enforced by comparing request JWT user ID with the user ID being updated).

**Endpoint:** `PUT /api/users/:id`

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The user's ID (username) to update |

**Request Body:**

```json
{
  "id": "string",
  "name": "string",
  "tocAccepted": boolean,
  "tocVersion": "string",
  "tocTimestamp": "ISO date string",
  "shares": [],
  "receives": [],
  "usage": [number],
  "isDeleted": boolean,
  "deletedAt": "ISO date string"
}
```

**Notes:**

- The request body should contain the **complete User object** with all fields
- The authenticated user must match the user ID being updated (from JWT token)
- All fields are updateable except for the `id` field itself

**Success Response:**

- **Status:** 200 OK
- **Body:** Updated User object

```json
{
  "id": "string",
  "name": "string",
  "tocAccepted": boolean,
  "tocVersion": "string",
  "tocTimestamp": "ISO date string",
  "shares": [],
  "receives": [],
  "usage": [number],
  "isDeleted": boolean,
  "deletedAt": "ISO date string"
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Attempting to update another user's profile or invalid token |
| `404` | Not Found | User not found |
| `500` | Internal Server Error | Server error updating user |

**Example:**

```bash
curl -X PUT http://localhost:3000/api/users/john_doe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "id": "john_doe",
    "name": "John Smith",
    "tocAccepted": true,
    "tocVersion": "1.0",
    "tocTimestamp": "2024-01-01T00:00:00Z",
    "shares": [],
    "receives": [],
    "usage": [45, 52, 48, 55],
    "isDeleted": false
  }'
```

---

### Delete User

Deletes a user profile from the system.

**Endpoint:** `DELETE /api/users/:id`

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The user's ID (username) to delete |

**Success Response:**

- **Status:** 204 No Content
- **Body:** Empty

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Invalid or expired token |
| `404` | Not Found | User not found |
| `500` | Internal Server Error | Server error deleting user |

**Example:**

```bash
curl -X DELETE http://localhost:3000/api/users/john_doe \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Create Data Share

Creates a data sharing relationship between two users. The authenticated user shares their data with another user.

**Endpoint:** `POST /api/users/:id/share`

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The user ID (username) initiating the share - must match authenticated user |

**Request Body:**

```json
{
  "withUserId": "string",
  "mode": "temporary | indefinite",
  "sharedAt": "ISO date string",
  "expiresAt": "ISO date string"
}
```

**Required Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `withUserId` | string | The ID (username) of the user receiving the share |

**Optional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `mode` | string | Share type: `temporary` (expires) or `indefinite` (ongoing). Defaults to `indefinite` if not provided |
| `sharedAt` | ISO date | When the share was created. Defaults to current timestamp if not provided |
| `expiresAt` | ISO date | When temporary share expires. Only used if mode is `temporary` |

**Sharing Details:**

- When a share is created, a **DataShare record is added to the sharer's `shares[]` array**
- A corresponding **DataShare record is added to the recipient's `receives[]` array**
- Both records contain the same information (mode, dates, etc.)
- The relationship is bidirectional for tracking purposes

**Success Response:**

- **Status:** 200 OK
- **Body:** Updated User object (the sharer) with the new share added to `shares[]`

```json
{
  "id": "string",
  "name": "string",
  "tocAccepted": boolean,
  "tocVersion": "string",
  "tocTimestamp": "ISO date string",
  "shares": [
    {
      "withUserId": "string",
      "mode": "temporary | indefinite",
      "sharedAt": "ISO date string",
      "expiresAt": "ISO date string"
    }
  ],
  "receives": [],
  "usage": [number],
  "isDeleted": boolean,
  "deletedAt": "ISO date string"
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `400` | Bad Request | Missing or invalid `withUserId` field |
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Attempting to share from another user's account or invalid token |
| `404` | Not Found | Sharer user not found (recipient may not exist but share is still created) |
| `500` | Internal Server Error | Server error creating share |

**Example:**

```bash
# Create an indefinite share
curl -X POST http://localhost:3000/api/users/john_doe/share \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "withUserId": "jane_smith",
    "mode": "indefinite"
  }'

# Create a temporary share that expires in 7 days
curl -X POST http://localhost:3000/api/users/john_doe/share \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "withUserId": "doctor_smith",
    "mode": "temporary",
    "expiresAt": "2024-02-03T00:00:00Z"
  }'
```

---

### Delete Data Share

Removes a data sharing relationship between two users. The authenticated user stops sharing their data with another user.

**Endpoint:** `DELETE /api/users/:id/share/:withUserId`

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The user ID (username) stopping the share - must match authenticated user |
| `withUserId` | string | The ID (username) of the user to stop sharing with |

**Sharing Details:**

- Removes the DataShare record from the sharer's `shares[]` array
- Removes the corresponding DataShare record from the recipient's `receives[]` array
- The relationship is completely removed from both sides

**Success Response:**

- **Status:** 200 OK
- **Body:** Updated User object (the sharer) with the share removed from `shares[]`

```json
{
  "id": "string",
  "name": "string",
  "tocAccepted": boolean,
  "tocVersion": "string",
  "tocTimestamp": "ISO date string",
  "shares": [],
  "receives": [],
  "usage": [number],
  "isDeleted": boolean,
  "deletedAt": "ISO date string"
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Attempting to stop sharing from another user's account or invalid token |
| `404` | Not Found | Sharer user not found |
| `500` | Internal Server Error | Server error removing share |

**Example:**

```bash
curl -X DELETE http://localhost:3000/api/users/john_doe/share/jane_smith \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Data Models

### User Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique user identifier (username) - set during registration |
| `name` | string | User's display name |
| `tocAccepted` | boolean | Whether user has accepted current terms of service |
| `tocVersion` | string | Version of ToS accepted |
| `tocTimestamp` | ISO date | When ToS was accepted |
| `shares` | array of DataShare | Users this account is sharing data with |
| `receives` | array of DataShare | Users sharing data with this account |
| `usage` | array of numbers | User's usage tracking data (initialized during registration) |
| `isDeleted` | boolean | Whether account is marked for deletion |
| `deletedAt` | ISO date | When account was marked for deletion |

### DataShare Object

| Field | Type | Description |
|-------|------|-------------|
| `withUserId` | string | The other user's ID (username) |
| `mode` | string | Share type: `temporary` (has expiration) or `indefinite` (no expiration) |
| `sharedAt` | ISO date | When the share was created |
| `expiresAt` | ISO date | When temporary share expires (only present for temporary shares) |

---

## Access Control

### Protected Endpoints

All user endpoints require authentication via JWT token. The token user ID (extracted from JWT by auth middleware) is used for access control:

- **GET /api/users** - Any authenticated user can view all users
- **GET /api/users/:id** - Any authenticated user can view any user's profile
- **POST /api/users** - Any authenticated user can create users
- **PUT /api/users/:id** - User can only update their own profile (enforced by comparing JWT user ID)
- **DELETE /api/users/:id** - Users can delete user records
- **POST /api/users/:id/share** - User can only initiate shares from their own account
- **DELETE /api/users/:id/share/:withUserId** - User can only remove shares from their own account

### Authentication to Auth Service

When a user registers via `/api/auth/register`:
1. Credentials are created in the credential store (username/password hash)
2. A User profile is automatically created with:
   - `id` = username
   - `name` = username (default)
   - `tocAccepted` = false
   - `usage` = array of 156 random numbers (0-99)
   - `shares` = empty array
   - `receives` = empty array

The user ID from the JWT token is derived from the same username/ID as the User profile.

---

## Common Workflows

### Register a User and Retrieve Profile

```bash
# 1. Register (creates credentials and User profile)
RESPONSE=$(curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.token')

# 2. Get the created user profile
curl -X GET http://localhost:3000/api/users/john_doe \
  -H "Authorization: Bearer $TOKEN"

# 3. Or get via auth service
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Share Data Between Users

```bash
# User 1 (john_doe) shares with User 2 (jane_smith)
curl -X POST http://localhost:3000/api/users/john_doe/share \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <john_token>" \
  -d '{
    "withUserId": "jane_smith",
    "mode": "indefinite"
  }'

# Verify - jane_smith should now see john_doe in their receives[]
curl -X GET http://localhost:3000/api/users/jane_smith \
  -H "Authorization: Bearer <jane_token>"

# Stop sharing
curl -X DELETE http://localhost:3000/api/users/john_doe/share/jane_smith \
  -H "Authorization: Bearer <john_token>"
```

### Temporary Share with Expiration

```bash
# Doctor shares patient data for 30 days
EXPIRE_DATE=$(date -u -d '+30 days' +%Y-%m-%dT%H:%M:%SZ)

curl -X POST http://localhost:3000/api/users/patient_id/share \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <patient_token>" \
  -d "{
    \"withUserId\": \"doctor_id\",
    \"mode\": \"temporary\",
    \"expiresAt\": \"$EXPIRE_DATE\"
  }"
```
