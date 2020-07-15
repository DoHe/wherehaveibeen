importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

if (workbox) {
    console.log("Yay! Workbox is loaded!");
    workbox.precaching.precacheAndRoute([]);

    // cache bulma
    workbox.routing.registerRoute(
        new RegExp("https://cdn.jsdelivr.net/npm/bulma(.*)"),
        new workbox.strategies.CacheFirst({
            cacheName: "bulma",
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
            ],
        })
    );

    // cache lodash
    workbox.routing.registerRoute(
        new RegExp("https://cdn.jsdelivr.net/npm/lodash(.*)"),
        new workbox.strategies.CacheFirst({
            cacheName: "lodash",
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
            ],
        })
    );

    /* Make your JS and CSS fast by returning the assets from the cache,
     while making sure they are updated in the background for the next use.
    */
    workbox.routing.registerRoute(
        // cache js, css, scc files
        /.*\.(?:css|js|scss|)/,
        // use cache but update in the background ASAP
        new workbox.strategies.StaleWhileRevalidate({
            // use a custom cache name
            cacheName: "assets",
        })
    );

    /* Install a new service worker and have it update
   and control a web page as soon as possible
    */
    workbox.core.skipWaiting();
    workbox.core.clientsClaim();

} else {
    console.log("Oops! Workbox didn't load");
}