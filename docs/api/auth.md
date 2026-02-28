# Authentication Endpoints

## Overview

The authentication endpoints handle user registration, login, and token generation. A JWT token is issued upon successful authentication and must be included in the `Authorization` header for all protected endpoints.

## Endpoints

### Register User

Creates a new user account with credentials and initializes a user profile.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | Unique username for the account. Used as the user identifier. |
| `password` | string | Yes | User's password. Will be hashed before storage. |

**Success Response:**

- **Status:** 201 Created
- **Body:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Details:**

| Field | Type | Description |
|-------|------|-------------|
| `token` | string | JWT token valid for 24 hours. Use in `Authorization: Bearer <token>` header for protected endpoints. |

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `400` | Bad Request | Invalid input - username or password not provided or wrong type |
| `409` | Conflict | Username already exists |
| `500` | Internal Server Error | Server error during registration |

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'
```

---

### Login

Authenticates a user with credentials and returns a JWT token.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | The user's username |
| `password` | string | Yes | The user's password |

**Success Response:**

- **Status:** 200 OK
- **Body:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Details:**

| Field | Type | Description |
|-------|------|-------------|
| `token` | string | JWT token valid for 24 hours. Use in `Authorization: Bearer <token>` header for protected endpoints. |

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `400` | Bad Request | Invalid input - username or password not provided or wrong type |
| `401` | Unauthorized | Invalid username or password |
| `500` | Internal Server Error | Server error during login |

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'
```

---

### Get Current User

Retrieves the profile information of the currently authenticated user.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required - JWT token in `Authorization: Bearer <token>` header

**Success Response:**

- **Status:** 200 OK
- **Body:**

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

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique user identifier (username) |
| `name` | string | User's display name |
| `tocAccepted` | boolean | Whether user has accepted terms of service |
| `tocVersion` | string | Version of ToS accepted |
| `tocTimestamp` | ISO date | When ToS was accepted |
| `active` | boolean | Whether the account is active (true = active, false = inactive) |
| `deletedAt` | ISO date | When account was marked for deletion |


**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | Invalid or expired token |
| `404` | Not Found | User profile not found |
| `500` | Internal Server Error | Server error retrieving user |

**Example:**

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
> This endpoint allows users to retrieve their own profile information based on their authenticated JWT token. It requires a valid JWT token obtained from the login or register endpoints. This endpoint is useful for clients to confirm the identity of the authenticated user and access their profile details.
---

## Authentication Flow

### Typical User Journey

1. **Register:** New user calls `/register` with username and password
   - Response includes JWT token
   - User account profile is created automatically
   - Random usage data is initialized

2. **Login:** Existing user calls `/login` with username and password
   - Response includes JWT token
   - Token is valid for 24 hours

3. **Authenticated Requests:** Use token in `Authorization: Bearer <token>` header
   - Token expires after 24 hours
   - Call `/register` or `/login` again for a new token
   - Get current user info via `/me`

### Token Storage

Clients should securely store the JWT token and include it in the `Authorization` header for all subsequent protected requests:

```
Authorization: Bearer <token>
```

### Token Expiration

- Tokens expire after **24 hours**
- Expired tokens return status `403 Forbidden`
- Users must login/register again to obtain a new token
