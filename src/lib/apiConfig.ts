/**
 * Single place for public API + Socket.IO origins.
 *
 * Deployed S3 site is https → browsers block http:// and non-secure WebSocket to EB.
 * Set VITE_API_URL (e.g. https://tamtamapi.xyz) and optionally VITE_SOCKETIO_URL if Socket.IO
 * is on a different host (must still be https/wss from the browser).
 */
function trimTrailingSlashes(s: string): string {
  return s.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (raw) return trimTrailingSlashes(raw);
  return "https://tamtamapi.xyz";
}

/** Socket.IO server URL (no path; client uses /socket.io/ automatically). */
export function getSocketUrl(): string {
  const raw = import.meta.env.VITE_SOCKETIO_URL?.trim();
  if (raw) return trimTrailingSlashes(raw);
  return getApiBaseUrl();
}
