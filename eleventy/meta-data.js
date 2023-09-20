import fs from "node:fs/promises";

import { glob } from "glob";

import { DIRECTORIES } from "../eleventy.config.cjs";
import { BUILD_METADATA_URL, CACHE_ASSETS_URL } from "../public/js/config.js";

export async function writeMetaData() {
	await writeCacheAssets();
	await writeBuildInformation();
}

async function writeCacheAssets() {
	const filename = `${DIRECTORIES.output}${CACHE_ASSETS_URL}`;

	const publicFiles = await glob("**/*", {
		cwd: "public",
		nodir: true,
		ignore: ["sw.js", "img/default.social.*"],
	});

	const flagImageFiles = await glob("*.svg", {
		cwd: "data/flags",
		nodir: true,
	});

	/** @type {import("../types").CacheAssets} */
	const assets = [
		"/",
		BUILD_METADATA_URL,
		CACHE_ASSETS_URL,
		...publicFiles.map((file) => `/${file}`),
		...flagImageFiles.map((file) => `/img/${file}`),
	];

	// The service worker reinstalls if its code (or imported code) changes.
	// To avoid reinstallation due to different cache assets array order,
	// sort the array to create a stable order.
	assets.sort();

	const serializedAssets = JSON.stringify(assets, null, "\t");
	const serializedData = `export const CACHE_ASSETS = ${serializedAssets};`;

	console.log(`[meta] Writing ${filename}`);
	await fs.writeFile(filename, serializedData);
}

async function writeBuildInformation() {
	const filename = `${DIRECTORIES.output}${BUILD_METADATA_URL}`;

	/** @type {import("../types").BuildInformation} */
	const data = {
		date: new Date().toISOString(),
	};

	const serializedData = JSON.stringify(data, null, "\t");

	console.log(`[meta] Writing ${filename}`);
	await fs.writeFile(filename, serializedData);
}
