# `track-aggregate-view`

This document describes the aggregate tracking page implemented by `track-aggregate-view` in `packages/app/src/views/track-aggregate-view.ts`.

## Purpose

The aggregate view shows trend-level progress across multiple runs rather than a single run. It visualizes average left/right hand weight values over time and lets users change the time window.

## Route and Entry Point

- Route path: `/app/track?view=aggregate`
- Router behavior: `/app/track` checks `view` query parameter and renders `<track-aggregate-view>` when `view=aggregate`.
- Route protection: handled by `requiresAuth(...)` in `router.ts`.
- View source: `packages/app/src/views/track-aggregate-view.ts`
- Element tag: `track-aggregate-view`

## Dependencies

- `LitElement` for rendering/lifecycle.
- Mustang `Observer<Auth.Model>` for auth state.
- Shared `Run` type from `server/models`.
- Child chart component: `<aggregate-chart>` from `components/aggregate-chart.ts`.

## State Model in the View

Reactive/local fields used by the view:

- `_user?: Auth.User` — current auth state snapshot.
- `runs?: Partial<Run>[]` — fetched run list (limited payload).
- `timespan: number` — selected time window in milliseconds.
- `timestamps?: Date[]` — x-axis values derived from `run.began`.
- `leftData?: number[]` — y-values from `run.avgLeft`.
- `rightData?: number[]` — y-values from `run.avgRight`.
- `error?: string` — fetch error message.

## Authentication Behavior

Authorization header generation uses this order:

1. Mustang authenticated user token.
2. Fallback `localStorage` token.
3. No header if token is unavailable.

Because routing is protected, unauthenticated users are redirected before normal rendering.

## API Contract and Fetch Flow

- Endpoint: `GET /api/runs/limited-after`
- Query parameter used: `from=<ISO timestamp>`
- Request URL built by:
	- `fromDate = new Date(Date.now() - timespan)`
	- `searchParams.set("from", fromDate.toISOString())`

Response handling:

- Success:
	- assign response to `runs`
	- call `extractRunData()` to compute chart arrays
- Failure:
	- set `error`
	- set `runs = []`

## Timespan Selection

The view offers fixed time windows via `<select>`:

- Last 24 Hours
- Last 7 Days
- Last 30 Days
- Last Year

On selection change:

1. `timespan` is updated.
2. `hydrateRunData()` re-fetches data with a new `from` filter.
3. Chart updates with new data.

## Data Transformation (`extractRunData`)

After fetch, the view maps run list fields into chart series:

- `timestamps = runs.map(run => new Date(run.began || ""))`
- `leftData = runs.map(run => run.avgLeft || 0)`
- `rightData = runs.map(run => run.avgRight || 0)`

If no runs are available, all three arrays are set to empty arrays.

## Render States

The component renders three primary states:

1. **Error**: `Error loading run data...`
2. **Loading**: `Loading data...`
3. **Content**:
	 - title (`Your Progress`)
	 - navigation links (All Runs / Aggregate)
	 - timespan select control
	 - `<aggregate-chart>` bound with `leftData`, `rightData`, `dates`

## Chart Integration Notes

`track-aggregate-view` does not render chart primitives directly. It passes prepared arrays into `<aggregate-chart>`, which:

- renders a bar chart with Chart.js,
- uses date values for x-axis labels,
- updates chart datasets when bound arrays change.

## Related Files

- `packages/app/src/router.ts`
- `packages/app/src/views/track-aggregate-view.ts`
- `packages/app/src/views/track-all-view.ts`
- `packages/app/src/components/aggregate-chart.ts`

## Current Implementation Notes

- `timespan` defaults to 24 hours (`1 * 24 * 60 * 60 * 1000`) despite an inline comment mentioning 7 days.
- Data fetch uses promise chaining in `hydrateRunData()`.
- `formatDate()` exists in the view but is not used by its current template.
