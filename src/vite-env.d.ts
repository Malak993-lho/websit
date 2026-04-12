/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional dev-only override for where Vite proxies `/admin` and `/api`.
   * Use when your API is not on localhost:5000 (see vite.config.ts).
   */
  readonly VITE_DEV_PROXY_TARGET?: string;
  /** e.g. https://tamtamapi.xyz — REST + default Socket.IO host */
  readonly VITE_API_URL?: string;
  /** Optional override if Socket.IO is not on same host as VITE_API_URL */
  readonly VITE_SOCKETIO_URL?: string;
}
