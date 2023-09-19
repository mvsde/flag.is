/// <reference lib="webworker" />

// @ts-expect-error
import { CACHE_ASSETS } from "./cache-assets.js";
import {
	BUILD_METADATA_URL,
	CACHE_CLEAR_EVENT,
	CACHE_NAME,
} from "./js/config.js";

const sw = /** @type {ServiceWorkerGlobalScope & typeof self} */ (self);
let cacheValidateTimeoutID;

sw.addEventListener("install", onInstall);
sw.addEventListener("fetch", onFetch);

/**
 * @param {ExtendableEvent} event
 */
function onInstall(event) {
	console.log("[SW] Install");

	sw.skipWaiting();

	const preCachedAssets = caches
		.open(CACHE_NAME)
		.then((cache) => cache.addAll(CACHE_ASSETS));

	event.waitUntil(preCachedAssets);
}

/**
 * @param {FetchEvent} event
 */
function onFetch(event) {
	if (location.origin !== new URL(event.request.url).origin) {
		return;
	}

	event.respondWith(getCachedResource(event.request));

	if (navigator.onLine) {
		clearTimeout(cacheValidateTimeoutID);
		cacheValidateTimeoutID = setTimeout(async () => validateCache(), 1000);
	}
}

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function getCachedResource(request) {
	const cache = await caches.open(CACHE_NAME);
	const cachedResponse = await cache.match(request);

	if (cachedResponse) {
		return cachedResponse;
	}

	const fetchedResponse = await fetch(request);
	cache.put(request, fetchedResponse.clone());

	return fetchedResponse;
}

async function validateCache() {
	const cache = await caches.open(CACHE_NAME);
	const cachedResponse = await cache.match(BUILD_METADATA_URL);

	const fetchedResponse = await fetch(BUILD_METADATA_URL);
	cache.put(BUILD_METADATA_URL, fetchedResponse.clone());

	if (!cachedResponse) {
		return;
	}

	/**
	 * @typedef {object} BuildMetadata
	 * @property {string} date
	 */

	/** @type {BuildMetadata} */
	const cachedData = await cachedResponse.json();

	/** @type {BuildMetadata} */
	const fetchedData = await fetchedResponse.json();

	if (cachedData.date !== fetchedData.date) {
		caches.delete(CACHE_NAME);

		for (const client of await sw.clients.matchAll()) {
			client.postMessage({ name: CACHE_CLEAR_EVENT });
		}
	}
}
