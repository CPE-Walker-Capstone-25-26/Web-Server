# API Documentation

## Overview

This is the general API documentation for the Web-Server application. The API provides endpoints for authentication, user management, and run data tracking. Detailed documentation for specific models and endpoints will be added separately to this directory.

## Base URL

```
http://localhost:3000/api
```

## General Information

### Content-Type

All requests and responses use `application/json`.

**Request:**
- Include `Content-Type: application/json` header for POST and PUT requests
- Maximum request body size: 10 MB

**Response:**
- All responses are JSON formatted
- Successful responses include the requested data
- Error responses include an error message

### CORS

The API is configured to accept requests from `http://localhost:5173` with the following allowed methods:
- GET
- POST
- PUT
- DELETE
- OPTIONS

The `Authorization` header is explicitly allowed for cross-origin requests.

## Authentication

### Overview

Protected endpoints require authentication via JWT (JSON Web Token). Authentication is handled through the `/api/auth` routes.

### Token Format

Tokens are sent in the `Authorization` header using the Bearer scheme:

```
Authorization: Bearer <token>
```

### Token Expiration

Tokens expire after 24 hours.

### Unauthenticated Requests

Requests missing a valid token will receive:
- **Status 401** - No token provided
- **Status 403** - Invalid or expired token

## API Routes

The API is organized into the following main route collections:

### Authentication (`/api/auth`)

Handles user login, signup, and token generation. No authentication required.

**Status:** Public routes

### Users (`/api/users`)

Manages user accounts and profiles.

**Status:** Protected - Requires valid JWT token

### Runs (`/api/runs`)

Manages run data and tracking information.

**Status:** Protected - Requires valid JWT token

## Response Codes

The API uses standard HTTP status codes:

| Status | Description |
|--------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource successfully created |
| `400` | Bad Request - Invalid request parameters or body |
| `401` | Unauthorized - Missing or invalid authentication token |
| `403` | Forbidden - Insufficient permissions or invalid token |
| `404` | Not Found - Requested resource does not exist |
| `500` | Internal Server Error - Server error occurred |

## Error Responses

Error responses include a message describing the issue:

```json
{
  "error": "Description of the error"
}
```

## Model-Specific Documentation

Detailed documentation for each model is available in separate files:

- **Auth Endpoints** - `auth.md` (coming soon)
- **Users Model** - `users.md` (coming soon)
- **Runs Model** - `runs.md` (coming soon)

Refer to the model-specific documentation for detailed parameter requirements, request/response schemas, and endpoint-specific behavior.
