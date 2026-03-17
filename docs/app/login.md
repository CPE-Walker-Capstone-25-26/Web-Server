# Login Page Documentation

This document describes the behavior of the login page implemented in `packages/app/public/login.html` and its relationship to signup.

## Purpose

The login page authenticates an existing user by submitting username/password credentials to the backend and then redirecting into the app shell.

## File and Route Context

- Frontend file: `packages/app/public/login.html`
- Styles: `packages/app/public/styles/auth.css` (plus shared `styles.css`)
- Backend endpoint used: `POST /api/auth/login`
- Typical redirect target after success: `/app` route (or query-provided redirect)

## UI Structure

The page renders:

- heading: **User Login**,
- `#login-form` with:
  - `#username` text input,
  - `#password` password input,
  - submit button,
- link to `signup.html` for new users.

## Login Flow

1. Read `redirect` from URL query params (`redirect` defaults to `/`).
2. On submit, trim username and validate both fields are present.
3. Send `POST /api/auth/login` with JSON body:
	- `{ username, password }`
4. If response fails:
	- read error text and show an alert.
5. If response succeeds:
	- parse `{ token }`,
	- store `token` and `username` in `localStorage`,
	- dispatch an `auth:message` custom event (`auth/signin` payload),
	- redirect browser to `redirect` path.

## Error Handling

- Empty fields: alert (`Fill both fields`).
- Non-2xx response: alert with backend message.
- Network/runtime error: alert (`Network error`) and console log.

## Auth and Session Notes

- The page itself is a standalone HTML entry (outside the SPA route switch).
- Session bootstrap for the SPA relies on `localStorage` token and subsequent `/api/auth/me` checks in app startup.

## Brief Signup Relationship

Signup behavior is implemented in `packages/app/public/signup.html` and backend `packages/server/src/routes/auth.ts`.

When a user signs up:

1. Frontend submits `POST /api/auth/register`.
2. Backend creates a new authentication credential record (hashed password) and a new user record.
3. Backend returns a JWT for the new account.
4. Frontend stores the token, then redirects to the configured redirect target (default `login.html`).

In other words, signup creates the new auth model on the server, then returns the user to login by default so they can enter through the normal login/app flow.

## Backend Contract Reference

`/api/auth/login` (`packages/server/src/routes/auth.ts`):

- Validates username/password input.
- Verifies credentials.
- Checks user active status.
- Returns `{ token }` on success; `401` on unauthorized.

`/api/auth/register` (`packages/server/src/routes/auth.ts`):

- Validates username/password input.
- Creates credentials (`credential-svc`) and user profile (`user-svc`).
- Returns `{ token }` on success; `409` on duplicate/conflict.
