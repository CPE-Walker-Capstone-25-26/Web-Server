# `track-individual-view`

This document describes the individual run detail view implemented by `run-view` in `packages/app/src/views/track-individual-view.ts`.

## Purpose

The `track-individual` view displays one specific run in detail, including:

- timestamp of the run,
- left/right time-series chart data,
- summary metrics (distance, duration, steps, average hand weights).

It is the drill-down page linked from the all-runs listing.

## Route and Entry Point

- Route definition: `/app/track/:id`
- Router mapping: renders `<run-view src=${params.id}></run-view>`
- Source file: `packages/app/src/views/track-individual-view.ts`
- Custom element tag: `run-view`

The `src` property carries the run identifier used in API requests.

## Dependencies

- `LitElement` for component lifecycle and rendering.
- `@calpoly/mustang` `Observer<Auth.Model>` for auth state.
- Shared type `Run` from `server/models`.
- Child visualization component: `<run-chart>`.

## Data and State

Local reactive state:

- `src: string` — route parameter (run id).
- `_user?: Auth.User` — auth context snapshot.
- `run?: Run` — hydrated run payload.
- `error?: string` — fetch/render error state.

## Authentication and Authorization

Authorization header resolution order:

1. Use Mustang auth context token when authenticated.
2. Fallback to `localStorage` token.
3. If neither exists, request proceeds without header.

> Note: Route-level access guard is handled in `router.ts` by `requiresAuth(...)`, which redirects unauthenticated users to `login.html`.

## API Integration

- Endpoint called: `GET /api/runs/:id`
- URL base in view: `/api/runs`
- Full request: `fetch(/api/runs/${src}, { headers: authorization })`

Success path:

- parse JSON as `Run`
- assign to `this.run`
- render chart + detail panel

Error path:

- set `this.error = error.message`
- render error text

## Lifecycle Behavior

- `connectedCallback()`:
	- subscribes to auth updates,
	- loads run data when `src` is present.
- No polling or interval refresh.
- Data is fetched once per component mount with current implementation.

## Render States

The view has three render states:

1. **Error state** — `Error loading run data...`
2. **Loading state** — `Loading run data...`
3. **Content state** — date header, chart, and metrics

### Content Layout

- Container `.run-view-container` with centered max width.
- `<h2>` with formatted run timestamp (`MM/DD/YYYY, HH:MM AM/PM`).
- `<run-chart>` bound with:
	- `.leftData=${run.dataLeft}`
	- `.rightData=${run.dataRight}`
- Details panel `.run-info` showing:
	- distance (km)
	- duration (seconds)
	- steps
	- avg left/right hand weight

Missing metric values render as `N/A`.

## Data Contract Expectations

Expected `Run` fields used by this view:

- `began`
- `dataLeft`, `dataRight`
- `distanceKm`, `duration`, `steps`
- `avgLeft`, `avgRight`

If `began` is present, it is converted to a `Date` and formatted for display.

## Related Files

- `packages/app/src/router.ts` (route registration)
- `packages/app/src/views/track-all-view.ts` (links into `/app/track/:id`)
- `packages/app/src/components/run-chart.ts` (chart rendering)

## Known Implementation Notes

- `hydrateRunData()` currently uses promise chaining rather than `await`.
- If `src` changes after initial mount, the view does not automatically refetch in current code.
- Route auth guard plus header fallback both contribute to access safety and resilience.
