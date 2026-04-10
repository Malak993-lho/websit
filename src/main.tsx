import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Favicon must be absolute from site origin. A relative ./file.png breaks on SPA routes
// (e.g. /request-access → /request-access/file.png → 404 → browser shows default globe).
const faviconHref = new URL("tamtam-friends-BdsumSwQ.png?v=2", `${window.location.origin}/`).href;
const setFavicon = (rel: string, type?: string) => {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  if (type) el.type = type;
  el.href = faviconHref;
};
setFavicon("icon", "image/png");
setFavicon("shortcut icon", "image/png");
setFavicon("apple-touch-icon");

createRoot(document.getElementById("root")!).render(<App />);
