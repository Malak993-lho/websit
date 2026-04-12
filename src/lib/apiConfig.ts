/**
 * REST API base URL + **live chat** Socket.IO origin.
 *
 * REST: `VITE_API_URL` (see `.env` / `.env.example`); default public API tamtamapi.xyz.
 * Live chat: always `https://admin.tamtamapi.xyz` unless `VITE_LIVE_CHAT_SOCKET_URL`
 * or `VITE_SOCKETIO_URL` is set (explicit override only — not derived from the REST host).
 */
function trimTrailingSlashes(s: string): string {
  return s.replace(/\/+$/, "");
}

const DEFAULT_API_BASE = "https://tamtamapi.xyz";

/** Live chat (Socket.IO) origin; client connects to `${origin}/socket.io/`. */
const DEFAULT_LIVE_CHAT_SOCKET_ORIGIN = "https://admin.tamtamapi.xyz";

/** Map legacy admin subdomain to the public API host (avoids browser CORS on the marketing site). */
function normalizePublicApiOrigin(base: string): string {
  try {
    const u = new URL(base);
    if (u.hostname.toLowerCase() !== "admin.tamtamapi.xyz") {
      return trimTrailingSlashes(base);
    }
    u.hostname = "tamtamapi.xyz";
    if (u.protocol === "http:") u.protocol = "https:";
    const path = u.pathname && u.pathname !== "/" ? u.pathname.replace(/\/+$/, "") : "";
    return trimTrailingSlashes(`${u.origin}${path}`);
  } catch {
    return trimTrailingSlashes(base);
  }
}

function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  const resolved = raw ? trimTrailingSlashes(raw) : trimTrailingSlashes(DEFAULT_API_BASE);
  return normalizePublicApiOrigin(resolved);
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
  return DEFAULT_LIVE_CHAT_SOCKET_ORIGIN;
}
