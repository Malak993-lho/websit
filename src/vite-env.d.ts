/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** e.g. https://tamtamapi.xyz — REST + default Socket.IO host */
  readonly VITE_API_URL?: string;
  /** Optional override if Socket.IO is not on same host as VITE_API_URL */
  readonly VITE_SOCKETIO_URL?: string;
}
