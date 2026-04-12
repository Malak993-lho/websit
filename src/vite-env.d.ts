/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional dev-only override for where Vite proxies `/admin` and `/api`.
   * Use when your API is not on localhost:5000 (see vite.config.ts).
   */
  readonly VITE_DEV_PROXY_TARGET?: string;
  /** REST API origin (default in code: https://admin.tamtamapi.xyz) */
  readonly VITE_API_URL?: string;
  /** Optional override for live chat Socket.IO origin (default matches REST / admin host) */
  readonly VITE_LIVE_CHAT_SOCKET_URL?: string;
  /** Optional override for live chat Socket.IO origin (alias of VITE_LIVE_CHAT_SOCKET_URL) */
  readonly VITE_SOCKETIO_URL?: string;
}
