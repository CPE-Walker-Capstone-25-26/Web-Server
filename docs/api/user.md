# User Endpoints

## Overview

The user endpoints manage user profiles. All endpoints are **protected** and require a valid JWT token in the `Authorization: Bearer <token>` header.

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
    "active": boolean,
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
  "active": boolean,
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
  "active": boolean,
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
| `active` | boolean | Whether the account is active (defaults to true) |
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
  "active": boolean,
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
    "active": true
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
  "active": boolean,
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
  "active": boolean,
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
    "active": true
  }'
```

---

### Deactivate User
Marks a user account as inactive (soft delete). The user record remains in the database but is marked as inactive and cannot be used for authentication.

**Endpoint:** `POST /api/users/:id/disable`

**Authentication:** Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The user's ID (username) to deactivate |

**Success Response:**
- **Status:** 200 OK
- **Body:** Updated User object with `active` set to false and `deletedAt` set to current timestamp

```json
{
  "id": "string",
  "name": "string",
  "tocAccepted": boolean,
  "tocVersion": "string",
  "tocTimestamp": "ISO date string",
  "active": false,
  "deletedAt": "ISO date string"
}
```

**Error Responses:**
| Status | Error | Description |
|--------|-------|-------------|
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Attempting to deactivate another user's profile or invalid token |
| `404` | Not Found | User not found |

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

## Data Models

### User Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique user identifier (username) - set during registration |
| `name` | string | User's display name |
| `tocAccepted` | boolean | Whether user has accepted current terms of service |
| `tocVersion` | string | Version of ToS accepted |
| `tocTimestamp` | ISO date | When ToS was accepted |
| `active` | boolean | Whether the account is active (true = active, false = inactive) |
| `deletedAt` | ISO date | When account was marked for deletion |
---

## Access Control

### Protected Endpoints

All user endpoints require authentication via JWT token. The token user ID (extracted from JWT by auth middleware) is used for access control:

- **GET /api/users** - Any authenticated user can view all users
- **GET /api/users/:id** - Any authenticated user can view any user's profile
- **POST /api/users** - Any authenticated user can create users
- **PUT /api/users/:id** - User can only update their own profile (enforced by comparing JWT user ID)
- **DELETE /api/users/:id** - Users can delete user records

### Authentication to Auth Service

When a user registers via `/api/auth/register`:
1. Credentials are created in the credential store (username/password hash)
2. A User profile is automatically created with:
   - `id` = username
   - `name` = username (default)
   - `tocAccepted` = false
   - `active` = true

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

### Update User Profile

```bash
# Update user's name and active status
curl -X PUT http://localhost:3000/api/users/john_doe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "id": "john_doe",
    "name": "Johnny Smith",
    "tocAccepted": true,
    "tocVersion": "1.0",
    "tocTimestamp": "2024-01-01T00:00:00Z",
    "active": true
  }'
```
