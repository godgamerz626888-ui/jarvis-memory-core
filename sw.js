
"use strict";

const CACHE_NAME = "jarvis-stage1-v1";

const APP_FILES = [
  "./",
    "./index.html",
      "./app.js",
        "./manifest.webmanifest"
        ];

        // Install and cache the app files
        self.addEventListener("install", event => {
          event.waitUntil(
              caches.open(CACHE_NAME)
                    .then(cache => cache.addAll(APP_FILES))
                          .then(() => self.skipWaiting())
                            );
                            });

                            // Activate and remove old JARVIS caches
                            self.addEventListener("activate", event => {
                              event.waitUntil(
                                  caches.keys().then(cacheNames => {
                                        return Promise.all(
                                                cacheNames
                                                          .filter(name =>
                                                                      name.startsWith("jarvis-stage1-") &&
                                                                                  name !== CACHE_NAME
                                                                                            )
                                                                                                      .map(name => caches.delete(name))
                                                                                                            );
                                                                                                                }).then(() => self.clients.claim())
                                                                                                                  );
                                                                                                                  });

                                                                                                                  // Serve cached files when offline
                                                                                                                  self.addEventListener("fetch", event => {
                                                                                                                    if (event.request.method !== "GET") {
                                                                                                                        return;
                                                                                                                          }

                                                                                                                            const requestURL = new URL(event.request.url);

                                                                                                                              if (requestURL.origin !== self.location.origin) {
                                                                                                                                  return;
                                                                                                                                    }

                                                                                                                                      event.respondWith(
                                                                                                                                          caches.match(event.request).then(cachedResponse => {
                                                                                                                                                if (cachedResponse) {
                                                                                                                                                        return cachedResponse;
                                                                                                                                                              }

                                                                                                                                                                    return fetch(event.request).then(networkResponse => {
                                                                                                                                                                            if (
                                                                                                                                                                                      networkResponse &&
                                                                                                                                                                                                networkResponse.status === 200 &&
                                                                                                                                                                                                          networkResponse.type === "basic"
                                                                                                                                                                                                                  ) {
                                                                                                                                                                                                                            const responseCopy = networkResponse.clone();

                                                                                                                                                                                                                                      caches.open(CACHE_NAME).then(cache => {
                                                                                                                                                                                                                                                  cache.put(event.request, responseCopy);
                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                            return networkResponse;
                                                                                                                                                                                                                                                                                  }).catch(() => {
                                                                                                                                                                                                                                                                                          if (event.request.mode === "navigate") {
                                                                                                                                                                                                                                                                                                    return caches.match("./index.html");
                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                    return new Response("Offline: file not cached.", {
                                                                                                                                                                                                                                                                                                                              status: 503,
                                                                                                                                                                                                                                                                                                                                        headers: {
                                                                                                                                                                                                                                                                                                                                                    "Content-Type": "text/plain"
                                                                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                                                      });
                                                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                                                                })
                                                                                                                                                                                                                                                                                                                                                                                  );
                                                                                                                                                                                                                                                                                                                                                                                  });
                                                                                                                                                                                                                                                                                                                                                                                  