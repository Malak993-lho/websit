import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Dev: same-origin /admin and /api proxy to the Flask API (local or remote).
  const apiProxyTarget = trimTrailingSlash(
    env.VITE_DEV_PROXY_TARGET?.trim()
      || env.VITE_API_URL?.trim()
      || "http://127.0.0.1:5000",
  );

  return {
  // Relative paths; assets at dist root (matches S3 flat uploads)
  base: "./",
  build: {
    assetsDir: ".",
  },
  server: {
    host: "::",
    port: 5731,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/admin": { target: apiProxyTarget, changeOrigin: true, secure: true },
      "/api": { target: apiProxyTarget, changeOrigin: true, secure: true },
      // Local Flask is http:// — secure:true can confuse the WS upgrade to /socket.io
      "/socket.io": {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
};
});

function trimTrailingSlash(s: string): string {
  return s.replace(/\/+$/, "");
}
