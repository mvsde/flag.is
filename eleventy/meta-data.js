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

	/** @type {import("../types").CacheAssets} */
	const assets = [
		"/",
		BUILD_METADATA_URL,
		...publicFiles.map((file) => `/${file}`),
	];

	const serializedData = JSON.stringify(assets, null, "\t");

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
