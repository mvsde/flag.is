/// <reference lib="webworker" />

import {
	BUILD_METADATA_URL,
	CACHE_ASSETS_URL,
	CACHE_NAME,
	EVENT,
} from "./js/config.js";

const sw = /** @type {ServiceWorkerGlobalScope & typeof self} */ (self);
let cacheValidateTimeoutID;

sw.addEventListener("install", onInstall);
sw.addEventListener("fetch", onFetch);
sw.addEventListener("message", onMessage);

/**
 * @param {ExtendableEvent} event
 */
function onInstall(event) {
	console.log("[SW] Install");

	sw.skipWaiting();
	event.waitUntil(preCache());
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
 * @param {ExtendableMessageEvent} event
 */
function onMessage(event) {
	const name = event.data.name;

	if (name === EVENT.START_UPDATE) {
		refreshCache();
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

	if (!cachedResponse) {
		return;
	}

	/** @type {import("../types").BuildInformation} */
	const cachedData = await cachedResponse.json();

	/** @type {import("../types").BuildInformation} */
	const fetchedData = await fetchedResponse.json();

	if (cachedData.date === fetchedData.date) {
		return;
	}

	messageToClients({ name: EVENT.UPDATE_AVAILABLE });
}

async function preCache() {
	const cache = await caches.open(CACHE_NAME);
	const assets = await getCacheAssetsList();

	await cache.addAll(assets);
}

async function refreshCache() {
	await caches.delete(CACHE_NAME);

	// Pretend update is done before the cache has been repopulated so the site
	// can already reload and show downloaded content progressively.
	messageToClients({ name: EVENT.UPDATE_DONE });

	await preCache();
}

/**
 * @returns {Promise<string[]>}
 */
async function getCacheAssetsList() {
	const response = await fetch(CACHE_ASSETS_URL);
	return response.json();
}

/**
 * @param {import("../types").SWMessage} message
 */
async function messageToClients(message) {
	const clients = await sw.clients.matchAll();

	for (const client of clients) {
		client.postMessage(message);
	}
}
