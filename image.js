import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

import { DIRECTORIES } from "./eleventy.config.cjs";

/**
 * @param {string} inputPath
 * @param {"flag"} [preset]
 */
export async function generateImage(inputPath, preset) {
	if (preset === "flag") {
		return createFlag(inputPath);
	}

	return inputPath;
}

/** @type {Map<string, sharp.Sharp>} */
const flagCache = new Map();

/**
 * @param {string} inputPath Input path
 * @returns {Promise<string>} Output path
 */
async function createFlag(inputPath) {
	const id = path.basename(inputPath, path.extname(inputPath));

	const outputURL = `img/${id}.social.png`;
	const outputPath = `${DIRECTORIES.output}/${outputURL}`;

	const width = 1200;
	const height = 630;

	const file = await fs.readFile(inputPath);
	const hash = crypto.createHash("sha256").update(file).digest("hex");

	let image = flagCache.get(hash);

	// Create new image if cache is empty
	if (!image) {
		console.log(`[img] Creating ${outputPath} from ${inputPath}`);

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

		flagCache.set(hash, image);
	}

	// Write image file
	await fs.mkdir(path.dirname(outputPath), { recursive: true });
	await image.toFile(outputPath);

	return outputURL;
}
