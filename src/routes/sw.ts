import { createFileRoute } from "@tanstack/react-router"

// Generate a unique ID when the server starts.
// Any server restart/redeployment will generate a new ID, triggering an update.
const SERVER_STARTUP_ID = `build-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

export const Route = createFileRoute("/sw")({
  server: {
    handlers: {
      GET: async () => {
        const serviceWorkerScript = `
const BUILD_ID = ${JSON.stringify(SERVER_STARTUP_ID)};
console.log("[Service Worker] Active with BUILD_ID:", BUILD_ID);

self.addEventListener("install", () => {
  self.skipWaiting = self.skipWaiting || (() => Promise.resolve());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
`.trim()

        return new Response(serviceWorkerScript, {
          headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            "Service-Worker-Allowed": "/",
          },
        })
      },
    },
  },
})
