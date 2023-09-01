import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

import { DIRECTORIES } from "./eleventy.config.cjs";

/** @type {Map<string, sharp.Sharp>} */
const cache = new Map();

/**
 * @param {string} inputPath Input path
 * @returns {Promise<string>} Output path
 */
export async function createSocialShareFlag(inputPath) {
	const name = path.basename(inputPath, path.extname(inputPath));
	const outputDir = "img/social";
	const outputPath = `${outputDir}/${name}.png`;

	const width = 1200;
	const height = 630;

	const file = await fs.readFile(inputPath);
	const hash = crypto.createHash("sha256").update(file).digest("hex");

	let image = cache.get(hash);

	// Create new image if cache is empty
	if (!image) {
		const flag = sharp(file).resize({
			width: width * 0.7,
			height: height * 0.7,
			fit: "inside",
		});

		const background = sharp(file)
			.resize({ width, height })
			.blur(process.env.NODE_ENV === "production" && 100)
			.ensureAlpha(0.3)
			.flatten({ background: "#fff" });

		image = sharp({
			create: {
				width,
				height,
				channels: 4,
				background: "#fff",
			},
		}).composite([
			{ input: await background.toBuffer() },
			{ input: await flag.toBuffer() },
		]);

		cache.set(hash, image);
	}

	// Write image file
	await fs.mkdir(`${DIRECTORIES.output}/${outputDir}`, { recursive: true });
	await image.toFile(`${DIRECTORIES.output}/${outputPath}`);

	return outputPath;
}
