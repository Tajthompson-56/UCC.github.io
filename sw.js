/**
 * sw.js — UCC IT Department Service Worker
 *
 * Authors: Marsha-Ann Genus (20233913) & Tajay Thompson (20205199)
 * Module:  ITT307 Internet Authoring II — Spring 2026
 *
 * Caching strategies:
 *   App shell (HTML/CSS/JS/fonts) → Cache-first, network fallback
 *   API calls  (/api/*)           → Network-first, cache fallback
 *   Images                        → Cache-first, lazy populate
 *   Navigation                    → Serve index.php from cache if offline
 */

'use strict';

const CACHE_VERSION = 'ucc-it-v1';
const API_CACHE     = 'ucc-it-api-v1';

/* Assets to pre-cache during install */
const PRECACHE = [
    '/index.php',
    '/style.css',
    '/app.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap'
];

/* ── INSTALL ────────────────────────────────────── */
self.addEventListener('install', function (event) {
    console.log('[SW] Installing…');
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(function (cache) {
                return cache.addAll(PRECACHE);
            })
            .then(function () {
                console.log('[SW] Pre-cache complete.');
                return self.skipWaiting();
            })
            .catch(function (err) {
                console.error('[SW] Pre-cache failed:', err);
            })
    );
});

/* ── ACTIVATE ────────────────────────────────────── */
self.addEventListener('activate', function (event) {
    console.log('[SW] Activating…');
    var allowed = [CACHE_VERSION, API_CACHE];
    event.waitUntil(
        caches.keys()
            .then(function (keys) {
                return Promise.all(
                    keys
                        .filter(function (k) { return !allowed.includes(k); })
                        .map(function (k) {
                            console.log('[SW] Deleting old cache:', k);
                            return caches.delete(k);
                        })
                );
            })
            .then(function () {
                return self.clients.claim();
            })
    );
});

/* ── FETCH ───────────────────────────────────────── */
self.addEventListener('fetch', function (event) {
    var req = event.request;

    /* Only handle GET requests */
    if (req.method !== 'GET') return;

    /* Skip chrome-extension and non-http requests */
    if (!req.url.startsWith('http')) return;

    var url = new URL(req.url);

    /* API calls — network first */
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirstAPI(req));
        return;
    }

    /* Navigation — serve cached index.php if offline */
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .catch(function () {
                    return caches.match('/index.php');
                })
        );
        return;
    }

    /* Everything else — cache first */
    event.respondWith(cacheFirst(req));
});

/* ── STRATEGY: Network-first (API) ──────────────── */
async function networkFirstAPI(req) {
    try {
        var res = await fetch(req);
        if (res && res.ok) {
            var cache = await caches.open(API_CACHE);
            cache.put(req, res.clone());
        }
        return res;
    } catch (err) {
        var cached = await caches.match(req);
        if (cached) return cached;
        /* Return a JSON error so the app handles it gracefully */
        return new Response(
            JSON.stringify({
                error:   'offline',
                message: 'You are offline. Showing cached course data.'
            }),
            {
                status:  503,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

/* ── STRATEGY: Cache-first ───────────────────────── */
async function cacheFirst(req) {
    var cached = await caches.match(req);
    if (cached) return cached;

    try {
        var res = await fetch(req);
        /* Only cache valid, same-origin or CORS responses */
        if (res && res.status === 200 && res.type !== 'opaque') {
            var cache = await caches.open(CACHE_VERSION);
            cache.put(req, res.clone());
        }
        return res;
    } catch (err) {
        /* Return SVG placeholder for failed image requests */
        if (req.destination === 'image') {
            return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#e8effe"/></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
            );
        }
        throw err;
    }
}

/* ── PUSH NOTIFICATIONS ─────────────────────────── */
self.addEventListener('push', function (event) {
    var data = {};
    try { data = event.data ? event.data.json() : {}; } catch (e) {}

    var options = {
        body:    data.body    || 'New update from the UCC IT Department.',
        icon:    '/icons/icon-192.png',
        badge:   '/icons/icon-96.png',
        tag:     'ucc-it-notification',
        data:    { url: data.url || '/index.php' },
        actions: [
            { action: 'open',    title: 'Open App' },
            { action: 'dismiss', title: 'Dismiss'  }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(
            data.title || 'UCC IT Department',
            options
        )
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    if (event.action !== 'dismiss') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});