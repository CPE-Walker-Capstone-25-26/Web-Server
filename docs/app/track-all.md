# `track-all-view`

This document describes the all-runs tracking page implemented by `track-all-view` in `packages/app/src/views/track-all-view.ts`.

## Purpose

The `track-all` view provides a list of the user’s runs and serves as the main browsing page for run history. It allows users to:

- scan runs in descending date order,
- open a specific run detail page,
- filter visible runs by a selected date range.

## Route and Entry Point

- Route path: `/app/track` (default tracking mode).
- Query behavior in router:
	- `?view=aggregate` renders aggregate view,
	- otherwise renders `<track-all-view>`.
- Route guard: `requiresAuth(...)` in `router.ts` redirects unauthenticated users to `login.html`.
- View source: `packages/app/src/views/track-all-view.ts`
- Element tag: `track-all-view`

## Dependencies

- `LitElement` for lifecycle/rendering.
- Mustang `Observer<Auth.Model>` for auth state.
- Shared `Run` type from `server/models` (used as `Partial<Run>` list items).

## View State

Reactive state managed in the component:

- `runs?: Partial<Run>[]` — loaded run summaries.
- `_user?: Auth.User` — auth context snapshot.
- `error?: string` — fetch error message.

## Authentication Header Behavior

Authorization headers are resolved in this order:

1. token from Mustang auth context (`_user`),
2. fallback token from `localStorage`,
3. undefined headers when token not found.

This complements the route-level auth guard.

## API Integration

- Endpoint used: `GET /api/runs/limited`
- Fetch call: `fetch('/api/runs/limited', { headers: authorization })`

Success behavior:

- stores response in `runs`,
- sorts runs by `began` descending (most recent first).

Error behavior:

- sets `error` to the thrown message,
- renders error state.

## Date Search / Filter Behavior

The view renders start/end date controls and a Search button.

### Input defaults

- `today` = current local date.
- `firstRunDate` = oldest run date in currently loaded list (or `today` fallback).

### On Search (`handleDateSearch`)

1. Reads values from `#start-date` and `#end-date`.
2. Validates `startDate <= endDate`.
3. Filters current `runs` array in memory by run date.
4. Replaces `this.runs` with filtered results.

Important behavior note:

- Filtering is client-side and mutates displayed list state.
- There is no explicit “reset filter” action in current implementation besides reloading/refetching.

## Render States

The component has three primary render states:

1. **Error** — `Error loading run data...`
2. **Loading** — `Loading run data...`
3. **Content** — header, view-switch links, date filter, and run cards

### Content Layout

- Header: `Your Progress`
- View links:
	- All Runs (underlined on this page)
	- Aggregate
- Date search controls
- Run card grid where each card includes:
	- link to `/app/track/${run.id}`
	- formatted run timestamp
	- distance (or fallback text)

If the array is empty, a “No runs found for the selected date range.” message is shown.

## Navigation Relationships

- Links from each card to individual run page (`/app/track/:id`), rendered by `run-view`.
- Provides top-level toggle link to aggregate view (`/app/track?view=aggregate`).

## Related Files

- `packages/app/src/router.ts`
- `packages/app/src/views/track-all-view.ts`
- `packages/app/src/views/track-individual-view.ts`
- `packages/app/src/views/track-aggregate-view.ts`

## Current Implementation Notes

- `handleDateSearch` accepts an event parameter but does not use it.
- Filtering is done on already loaded data rather than via a date-filtered API call.
- `hydrateRunData()` uses promise chaining and runs on initial component mount.
