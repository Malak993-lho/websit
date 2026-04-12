import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = trimTrailingSlash(
    env.VITE_API_URL?.trim() || "https://tamtamapi.xyz",
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
      "/socket.io": {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: true,
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
