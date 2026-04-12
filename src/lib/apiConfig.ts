/**
 * API + Socket.IO base URLs.
 *
 * Source of truth: `VITE_API_URL` (see `.env` / `.env.example`).
 * Fallback (if env unset): Admin Elastic Beanstalk backend until DNS/custom domain is ready.
 * Optional: `VITE_SOCKETIO_URL` when Socket.IO is not on the same host as the API.
 */
function trimTrailingSlashes(s: string): string {
  return s.replace(/\/+$/, "");
}

/** Admin EB public HTTP origin (no trailing slash). Not tamtamapi.xyz / not localhost API. */
const DEFAULT_API_BASE =
  "http://Admin-backend-env.eba-9pw38gcy.us-west-2.elasticbeanstalk.com";

function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (raw) return trimTrailingSlashes(raw);
  return trimTrailingSlashes(DEFAULT_API_BASE);
}

export function getApiBaseUrl(): string {
  return resolveApiBaseUrl();
}

export function getWishesApiBaseUrl(): string {
  return resolveApiBaseUrl();
}

/** Socket.IO server URL (no path; client uses /socket.io/ automatically). */
export function getSocketUrl(): string {
  const raw = import.meta.env.VITE_SOCKETIO_URL?.trim();
  if (raw) return trimTrailingSlashes(raw);
  return resolveApiBaseUrl();
}
