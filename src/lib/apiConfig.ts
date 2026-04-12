/**
 * Single default backend: `https://admin.tamtamapi.xyz` for REST and live chat (same origin
 * avoids CORS when the site is served from e.g. `app.tamtamapi.xyz`).
 *
 * Override REST: `VITE_API_URL`. Override Socket.IO only: `VITE_LIVE_CHAT_SOCKET_URL` or
 * `VITE_SOCKETIO_URL`.
 */
function trimTrailingSlashes(s: string): string {
  return s.replace(/\/+$/, "");
}

const DEFAULT_BACKEND_ORIGIN = "https://admin.tamtamapi.xyz";

function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  return raw ? trimTrailingSlashes(raw) : DEFAULT_BACKEND_ORIGIN;
}

export function getApiBaseUrl(): string {
  return resolveApiBaseUrl();
}

export function getWishesApiBaseUrl(): string {
  return resolveApiBaseUrl();
}

/** Live chat Socket.IO server origin (no path; client uses `/socket.io/` automatically). */
export function getSocketUrl(): string {
  const raw =
    import.meta.env.VITE_LIVE_CHAT_SOCKET_URL?.trim() ||
    import.meta.env.VITE_SOCKETIO_URL?.trim();
  if (raw) return trimTrailingSlashes(raw);
  return DEFAULT_BACKEND_ORIGIN;
}
